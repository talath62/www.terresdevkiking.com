import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../components/ValhallaAdmin.css'
import './Page.css'

const EMPTY_REWARD = { name: '', prefabName: '', quantity: 1, chance: 1, active: true }

async function apiRequest(path, options) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Une erreur est survenue')
  return data
}

export default function AdminValhallaPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [rewards, setRewards] = useState([])
  const [users, setUsers] = useState([])
  const [spins, setSpins] = useState([])
  const [form, setForm] = useState(EMPTY_REWARD)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/auth/me').then((data) => {
      if (!data.authenticated || data.user?.role !== 'admin') {
        navigate('/', { replace: true })
        return
      }
      setChecking(false)
    }).catch(() => navigate('/', { replace: true }))
  }, [navigate])

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
  }, [])

  useEffect(() => { if (!checking) load() }, [checking, load])

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

  if (checking) return null

  return (
    <div className="page-shell admin-valhalla-page">
      <section className="valhalla-admin-page">
        <header>
          <span><a href="/" className="admin-valhalla-back">&larr; Retour au site</a></span>
          <h2>Roue du Valhalla</h2>
          <p>Administration des récompenses, des utilisateurs et des tickets.</p>
        </header>
        {error && <p className="wheel-error">{error}</p>}

        <div className="valhalla-admin-grid">
          <div className="valhalla-admin-panel">
            <h3>{editingId ? 'Modifier le lot' : 'Ajouter un lot'}</h3>
            <form className="valhalla-reward-form" onSubmit={submitReward}>
              <input placeholder="Nom affiché" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <input placeholder="Prefab Valheim" value={form.prefabName} onChange={(event) => setForm({ ...form, prefabName: event.target.value })} required />
              <label>Quantité<input type="number" min="1" max="9999" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} required /></label>
              <label>Chance (%)<input type="number" min="0.1" max="100" step="0.1" value={form.chance} onChange={(event) => setForm({ ...form, chance: Number(event.target.value) })} required /></label>
              <label className="valhalla-check"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Actif</label>
              <button type="submit">{editingId ? 'Enregistrer' : 'Créer le lot'}</button>
              {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(EMPTY_REWARD) }}>Annuler</button>}
            </form>
          </div>

          <div className="valhalla-admin-panel valhalla-list-panel">
            <h3>Récompenses</h3>
            <p className="valhalla-panel-note">Chaque récompense active devient un segment de la roue. Le total des chances ne doit pas dépasser 100 %.</p>
            <div className={`valhalla-reward-total ${totalChance === 100 ? 'is-complete' : ''}`}>
              <span>Total : <strong>{totalChance.toFixed(1)} %</strong> / 100 %</span>
              <i><b style={{ width: `${Math.min(totalChance, 100)}%` }} /></i>
            </div>
            <div className="valhalla-list">
              {rewards.map((reward, index) => <article key={reward.id} className={!reward.active ? 'disabled' : ''}><span className="valhalla-reward-index">{index + 1}</span><div><strong>{reward.name}</strong><small>{reward.prefab_name} × {reward.quantity} · {reward.chance} % {!reward.active && '· Inactif'}</small></div><button type="button" onClick={() => editReward(reward)}>Modifier</button><button type="button" className="danger" onClick={() => deleteReward(reward.id)}>Supprimer</button></article>)}
              {!rewards.length && <p>Aucun lot configuré.</p>}
            </div>
          </div>
        </div>

        <div className="valhalla-admin-panel">
          <h3>Joueurs et tickets</h3>
          <p className="valhalla-panel-note">Un ticket permet un lancement de la roue. La récompense gagnée est automatiquement livrée au personnage enregistré.</p>
          <div className="valhalla-user-list">
            {users.map((user) => (
              <article className="valhalla-user-card" key={user.id}>
                {user.avatar_url ? <img src={user.avatar_url} alt="" referrerPolicy="no-referrer" /> : <span className="valhalla-user-avatar">ᛉ</span>}
                <div className="valhalla-user-identity">
                  <strong>{user.player_name || 'Personnage non renseigné'} {user.role === 'admin' && <em>Administrateur</em>}</strong>
                  <span>{user.name} · {user.email}</span>
                  <small>Inscrit le {new Date(`${user.created_at}Z`).toLocaleDateString('fr-FR')} · Dernière activité {new Date(`${user.last_seen_at}Z`).toLocaleString('fr-FR')} · {user.delivered_count}/{user.spin_count} lots livrés</small>
                </div>
                <div className="valhalla-user-tickets"><strong>{user.tickets}</strong><span>ticket{user.tickets > 1 ? 's' : ''}</span></div>
                <div className="valhalla-user-actions"><button type="button" onClick={() => changeTickets(user.id, 1)}>🎁 Donner 1 ticket</button><button type="button" className="secondary" disabled={user.tickets < 1} onClick={() => changeTickets(user.id, -1)}>Retirer 1</button></div>
              </article>
            ))}
          </div>
        </div>

        <div className="valhalla-admin-panel">
          <h3>Derniers tirages</h3>
          <div className="valhalla-table-wrap"><table><thead><tr><th>Date</th><th>Joueur</th><th>Lot</th><th>État</th></tr></thead><tbody>{spins.map((spin) => <tr key={spin.id}><td>{new Date(`${spin.created_at}Z`).toLocaleString('fr-FR')}</td><td>{spin.player_name}</td><td>{spin.reward_name}</td><td className={`status-${spin.status}`}>{spin.status === 'delivered' ? 'Livré' : spin.status === 'failed' ? 'Échec' : 'En attente'}</td></tr>)}</tbody></table></div>
        </div>
      </section>
    </div>
  )
}
