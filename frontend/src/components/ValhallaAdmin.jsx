import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './ValhallaAdmin.css'

const EMPTY_REWARD = { name: '', prefabName: '', quantity: 1, chance: 1, active: true }

export default function ValhallaAdmin({ onClose, apiRequest }) {
  const [rewards, setRewards] = useState([])
  const [users, setUsers] = useState([])
  const [spins, setSpins] = useState([])
  const [form, setForm] = useState(EMPTY_REWARD)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [rewardData, userData, spinData] = await Promise.all([
        apiRequest('/api/valhalla/admin/rewards'),
        apiRequest('/api/valhalla/admin/users'),
        apiRequest('/api/valhalla/admin/spins'),
      ])
      setRewards(rewardData.rewards)
      setUsers(userData.users)
      setSpins(spinData.spins)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [apiRequest])

  useEffect(() => { load() }, [load])

  const submitReward = async (event) => {
    event.preventDefault()
    try {
      await apiRequest(`/api/valhalla/admin/rewards${editingId ? `/${editingId}` : ''}`, { method: editingId ? 'PATCH' : 'POST', body: JSON.stringify(form) })
      setForm(EMPTY_REWARD)
      setEditingId(null)
      load()
    } catch (requestError) { setError(requestError.message) }
  }

  const editReward = (reward) => {
    setEditingId(reward.id)
    setForm({ name: reward.name, prefabName: reward.prefab_name, quantity: reward.quantity, chance: reward.chance, active: Boolean(reward.active) })
  }

  const deleteReward = async (id) => {
    if (!window.confirm('Supprimer définitivement cette récompense ?')) return
    try { await apiRequest(`/api/valhalla/admin/rewards/${id}`, { method: 'DELETE' }); load() } catch (requestError) { setError(requestError.message) }
  }

  const changeTickets = async (id, amount) => {
    try { await apiRequest(`/api/valhalla/admin/users/${id}/tickets`, { method: 'POST', body: JSON.stringify({ amount }) }); load() } catch (requestError) { setError(requestError.message) }
  }

  const totalChance = rewards.filter((reward) => reward.active).reduce((sum, reward) => sum + reward.chance, 0)

  return (
    <div className="valhalla-admin-backdrop" onMouseDown={onClose}>
      <section className="valhalla-admin" onMouseDown={(event) => event.stopPropagation()}>
        <button className="valhalla-admin-close" type="button" onClick={onClose}>✕</button>
        <header><span>ᛟ Administration</span><h2>Roue du Valhalla</h2><p>Probabilités actives : <strong>{totalChance.toFixed(1)} %</strong></p></header>
        {error && <p className="wheel-error">{error}</p>}

        <div className="valhalla-admin-grid">
          <div className="valhalla-admin-panel">
            <h3>{editingId ? 'Modifier le lot' : 'Ajouter un lot'}</h3>
            <form className="valhalla-reward-form" onSubmit={submitReward}>
              <input placeholder="Nom affiché" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <input placeholder="Prefab Valheim" value={form.prefabName} onChange={(event) => setForm({ ...form, prefabName: event.target.value })} required />
              <label>Quantité<input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} required /></label>
              <label>Chance (%)<input type="number" min="0.01" max="100" step="0.01" value={form.chance} onChange={(event) => setForm({ ...form, chance: Number(event.target.value) })} required /></label>
              <label className="valhalla-check"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Actif</label>
              <button type="submit">{editingId ? 'Enregistrer' : 'Créer le lot'}</button>
              {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(EMPTY_REWARD) }}>Annuler</button>}
            </form>
          </div>

          <div className="valhalla-admin-panel valhalla-list-panel">
            <h3>Récompenses</h3>
            <div className="valhalla-list">
              {rewards.map((reward) => <article key={reward.id} className={!reward.active ? 'disabled' : ''}><div><strong>{reward.name}</strong><small>{reward.prefab_name} × {reward.quantity} · {reward.chance} %</small></div><button type="button" onClick={() => editReward(reward)}>Modifier</button><button type="button" className="danger" onClick={() => deleteReward(reward.id)}>Supprimer</button></article>)}
              {!rewards.length && <p>Aucun lot configuré.</p>}
            </div>
          </div>
        </div>

        <div className="valhalla-admin-panel">
          <h3>Joueurs et tickets</h3>
          <div className="valhalla-table-wrap"><table><thead><tr><th>Compte</th><th>Personnage</th><th>Tickets</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}<small>{user.email}</small></td><td>{user.player_name || 'Non renseigné'}</td><td>{user.tickets}</td><td><button type="button" onClick={() => changeTickets(user.id, 1)}>+1</button><button type="button" onClick={() => changeTickets(user.id, -1)}>-1</button></td></tr>)}</tbody></table></div>
        </div>

        <div className="valhalla-admin-panel">
          <h3>Derniers tirages</h3>
          <div className="valhalla-table-wrap"><table><thead><tr><th>Date</th><th>Joueur</th><th>Lot</th><th>État</th></tr></thead><tbody>{spins.map((spin) => <tr key={spin.id}><td>{new Date(`${spin.created_at}Z`).toLocaleString('fr-FR')}</td><td>{spin.player_name}</td><td>{spin.reward_name}</td><td className={`status-${spin.status}`}>{spin.status}</td></tr>)}</tbody></table></div>
        </div>
      </section>
    </div>
  )
}

ValhallaAdmin.propTypes = { onClose: PropTypes.func.isRequired, apiRequest: PropTypes.func.isRequired }
