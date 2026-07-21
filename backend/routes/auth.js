const crypto = require('crypto')
const express = require('express')
const db = require('../services/database')
const { STATE_COOKIE, cookieOptions, createSession, destroySession, getUser, hash, parseCookies, publicUser, requireUser } = require('../services/auth')

const router = express.Router()
const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

function oauthConfig(req) {
  const baseUrl = process.env.PUBLIC_URL || `${req.get('x-forwarded-proto') || req.protocol}://${req.get('host')}`
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${baseUrl}/api/auth/google/callback`,
  }
}

router.get('/status', (req, res) => {
  res.json({ googleConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) })
})

router.get('/google', (req, res) => {
  const config = oauthConfig(req)
  if (!config.clientId || !config.clientSecret) return res.status(503).send('Connexion Google non configurée')

  const state = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString()
  db.prepare('DELETE FROM oauth_states WHERE expires_at <= ?').run(new Date().toISOString())
  db.prepare('INSERT INTO oauth_states (state_hash, expires_at) VALUES (?, ?)').run(hash(state), expiresAt)
  res.cookie(STATE_COOKIE, state, cookieOptions(req, 10 * 60000))

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    state,
  })
  res.redirect(`${GOOGLE_AUTHORIZE_URL}?${params}`)
})

router.get('/google/callback', async (req, res) => {
  const state = String(req.query.state || '')
  const cookieState = parseCookies(req.get('cookie'))[STATE_COOKIE]
  const storedState = state && db.prepare('SELECT * FROM oauth_states WHERE state_hash = ? AND expires_at > ?').get(hash(state), new Date().toISOString())
  if (!cookieState || !state || cookieState !== state || !storedState) return res.status(400).send('État OAuth invalide ou expiré')

  db.prepare('DELETE FROM oauth_states WHERE state_hash = ?').run(hash(state))
  res.clearCookie(STATE_COOKIE, cookieOptions(req, 0))

  try {
    const config = oauthConfig(req)
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(req.query.code || ''),
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenResponse.ok) throw new Error('Échange du code Google refusé')
    const token = await tokenResponse.json()
    const profileResponse = await fetch(GOOGLE_USERINFO_URL, { headers: { Authorization: `Bearer ${token.access_token}` } })
    if (!profileResponse.ok) throw new Error('Profil Google indisponible')
    const profile = await profileResponse.json()

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const role = adminEmail && String(profile.email).toLowerCase() === adminEmail ? 'admin' : 'player'
    db.prepare(`
      INSERT INTO users (google_id, email, name, avatar_url, role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(google_id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        avatar_url = excluded.avatar_url,
        role = CASE WHEN excluded.role = 'admin' THEN 'admin' ELSE users.role END,
        last_seen_at = CURRENT_TIMESTAMP
    `).run(String(profile.id), profile.email || '', profile.name || '', profile.picture || '', role)
    const user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(String(profile.id))
    createSession(req, res, user.id)
    res.redirect('/?valhalla=open')
  } catch (error) {
    console.error('Google OAuth:', error)
    res.status(502).send('La connexion Google a échoué')
  }
})

router.get('/me', (req, res) => {
  const user = getUser(req)
  res.json({ authenticated: Boolean(user), user: user ? publicUser(user) : null })
})

router.patch('/profile', requireUser, (req, res) => {
  const playerName = String(req.body.playerName || '').trim()
  if (playerName.length < 2 || playerName.length > 64) return res.status(400).json({ message: 'Le nom en jeu doit contenir entre 2 et 64 caractères' })
  db.prepare('UPDATE users SET player_name = ? WHERE id = ?').run(playerName, req.user.id)
  res.json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)) })
})

router.post('/logout', (req, res) => {
  destroySession(req, res)
  res.status(204).end()
})

module.exports = router
