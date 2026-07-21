const express = require('express')
const crypto = require('crypto')
const db = require('../services/database')
const { getUser, publicUser, requireAdmin, requireUser } = require('../services/auth')

const router = express.Router()

function listPublicRewards() {
  return db.prepare('SELECT id, name FROM rewards WHERE active = 1 ORDER BY id').all()
}

function pickReward(rewards) {
  const total = rewards.reduce((sum, reward) => sum + reward.chance, 0)
  let draw = crypto.randomInt(0, 1000000000) / 1000000000 * total
  for (const reward of rewards) {
    draw -= reward.chance
    if (draw <= 0) return reward
  }
  return rewards[rewards.length - 1]
}

async function deliverReward(playerName, reward) {
  const url = process.env.VALHALLA_VM_URL || 'http://192.168.1.100:5088/api/tdv-reward'
  const secret = process.env.VALHALLA_VM_SECRET || ''
  if (!secret) throw new Error('Secret de livraison non configuré')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-TDV-Secret': secret },
    body: JSON.stringify({
      PlayerName: playerName,
      VoteNumber: 1,
      MailTopic: `Récompense Valhalla - ${reward.name}`,
      MailMessage: `Félicitations ${playerName} ! Tu as remporté ${reward.name} via la Roue du Valhalla.`,
      Reward: {
        Id: String(reward.id),
        Label: reward.name,
        Items: [{ Prefab: reward.prefab_name, Amount: reward.quantity }],
      },
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Livraison refusée (${response.status})`)
}

async function announceReward(playerName, rewardName) {
  const url = process.env.VALHALLA_DISCORD_WEBHOOK || ''
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Terres de Viking',
        embeds: [{
          title: '⚔ RÉCOMPENSE VALHALLA ⚔',
          description: `Les Walkyries acclament **${playerName}** !`,
          color: 0xFFD700,
          fields: [{ name: 'Récompense', value: rewardName, inline: true }, { name: 'Guerrier', value: playerName, inline: true }],
        }],
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (error) {
    console.error('Annonce Discord:', error.message)
  }
}

router.get('/state', (req, res) => {
  const user = getUser(req)
  res.json({
    configured: Boolean(process.env.VALHALLA_VM_SECRET),
    authenticated: Boolean(user),
    user: user ? publicUser(user) : null,
    rewards: listPublicRewards(),
  })
})

router.post('/spin', requireUser, async (req, res) => {
  if (!process.env.VALHALLA_VM_SECRET) return res.status(503).json({ message: 'La livraison des récompenses n’est pas encore configurée' })
  if (!req.user.player_name) return res.status(400).json({ error: 'PLAYER_NAME_REQUIRED', message: 'Renseigne d’abord ton nom de personnage Valheim' })

  const rewards = db.prepare('SELECT * FROM rewards WHERE active = 1 ORDER BY id').all()
  if (!rewards.length) return res.status(503).json({ message: 'Aucune récompense active' })

  let spin
  try {
    spin = db.transaction(() => {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
      if (user.tickets < 1) return null
      const reward = pickReward(rewards)
      db.prepare('UPDATE users SET tickets = tickets - 1 WHERE id = ?').run(user.id)
      const result = db.prepare('INSERT INTO spins (user_id, reward_id, player_name) VALUES (?, ?, ?)').run(user.id, reward.id, user.player_name)
      return { id: Number(result.lastInsertRowid), reward, tickets: user.tickets - 1, playerName: user.player_name }
    })()
  } catch (error) {
    console.error('Tirage Valhalla:', error)
    return res.status(500).json({ message: 'Le tirage a échoué' })
  }

  if (!spin) return res.status(400).json({ message: 'Aucun ticket disponible' })

  try {
    await deliverReward(spin.playerName, spin.reward)
    db.prepare("UPDATE spins SET status = 'delivered', delivered_at = CURRENT_TIMESTAMP WHERE id = ?").run(spin.id)
    announceReward(spin.playerName, spin.reward.name)
    res.json({ reward: { id: spin.reward.id, name: spin.reward.name }, tickets: spin.tickets })
  } catch (error) {
    db.transaction(() => {
      const current = db.prepare('SELECT status FROM spins WHERE id = ?').get(spin.id)
      if (current?.status === 'pending') {
        db.prepare('UPDATE users SET tickets = tickets + 1 WHERE id = ?').run(req.user.id)
        db.prepare("UPDATE spins SET status = 'failed', delivery_error = ? WHERE id = ?").run(error.message, spin.id)
      }
    })()
    console.error('Livraison Valhalla:', error.message)
    res.status(502).json({ message: 'La livraison a échoué. Ton ticket a été remboursé.' })
  }
})

router.get('/admin/rewards', requireAdmin, (req, res) => {
  res.json({ rewards: db.prepare('SELECT * FROM rewards ORDER BY id').all() })
})

router.post('/admin/rewards', requireAdmin, (req, res) => {
  const validation = validateReward(req.body)
  if (validation.error) return res.status(400).json({ message: validation.error })
  const total = db.prepare('SELECT COALESCE(SUM(chance), 0) AS total FROM rewards WHERE active = 1').get().total
  if (validation.active && total + validation.chance > 100.0001) return res.status(400).json({ message: `Le total dépasserait 100 % (actuel : ${total} %)` })
  const result = db.prepare('INSERT INTO rewards (name, prefab_name, quantity, chance, active) VALUES (?, ?, ?, ?, ?)').run(validation.name, validation.prefabName, validation.quantity, validation.chance, validation.active ? 1 : 0)
  res.status(201).json({ reward: db.prepare('SELECT * FROM rewards WHERE id = ?').get(result.lastInsertRowid) })
})

router.patch('/admin/rewards/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const current = db.prepare('SELECT * FROM rewards WHERE id = ?').get(id)
  if (!current) return res.status(404).json({ message: 'Récompense introuvable' })
  const validation = validateReward(req.body)
  if (validation.error) return res.status(400).json({ message: validation.error })
  const total = db.prepare('SELECT COALESCE(SUM(chance), 0) AS total FROM rewards WHERE active = 1 AND id != ?').get(id).total
  if (validation.active && total + validation.chance > 100.0001) return res.status(400).json({ message: `Le total dépasserait 100 % (hors lot : ${total} %)` })
  db.prepare('UPDATE rewards SET name = ?, prefab_name = ?, quantity = ?, chance = ?, active = ? WHERE id = ?').run(validation.name, validation.prefabName, validation.quantity, validation.chance, validation.active ? 1 : 0, id)
  res.json({ reward: db.prepare('SELECT * FROM rewards WHERE id = ?').get(id) })
})

router.delete('/admin/rewards/:id', requireAdmin, (req, res) => {
  const linked = db.prepare('SELECT COUNT(*) AS count FROM spins WHERE reward_id = ?').get(Number(req.params.id)).count
  if (linked) return res.status(409).json({ message: 'Ce lot possède un historique : désactive-le au lieu de le supprimer' })
  db.prepare('DELETE FROM rewards WHERE id = ?').run(Number(req.params.id))
  res.status(204).end()
})

router.get('/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.prepare('SELECT id, email, name, player_name, role, tickets, created_at FROM users ORDER BY created_at DESC').all() })
})

router.post('/admin/users/:id/tickets', requireAdmin, (req, res) => {
  const amount = Number(req.body.amount)
  if (!Number.isInteger(amount) || amount < -1000 || amount > 1000 || amount === 0) return res.status(400).json({ message: 'Quantité de tickets invalide' })
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.params.id))
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
  const tickets = Math.max(0, user.tickets + amount)
  db.prepare('UPDATE users SET tickets = ? WHERE id = ?').run(tickets, user.id)
  res.json({ tickets })
})

router.get('/admin/spins', requireAdmin, (req, res) => {
  res.json({ spins: db.prepare(`
    SELECT spins.id, spins.player_name, spins.status, spins.delivery_error, spins.created_at,
           rewards.name AS reward_name, users.email
    FROM spins JOIN rewards ON rewards.id = spins.reward_id JOIN users ON users.id = spins.user_id
    ORDER BY spins.id DESC LIMIT 100
  `).all() })
})

function validateReward(body) {
  const name = String(body.name || '').trim()
  const prefabName = String(body.prefabName || '').trim()
  const quantity = Number(body.quantity)
  const chance = Number(body.chance)
  const active = body.active !== false
  if (!name || name.length > 255) return { error: 'Nom de lot invalide' }
  if (!prefabName || prefabName.length > 255) return { error: 'Prefab invalide' }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) return { error: 'Quantité invalide' }
  if (!Number.isFinite(chance) || chance <= 0 || chance > 100) return { error: 'Chance invalide' }
  return { name, prefabName, quantity, chance, active }
}

module.exports = router
