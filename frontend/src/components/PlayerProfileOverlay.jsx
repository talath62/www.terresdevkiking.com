import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './PlayerProfileOverlay.css'

export default function PlayerProfileOverlay({ onClose, onSaved }) {
  const [user, setUser] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) throw new Error('La session Google n\'est plus active')
        setUser(data.user)
        setPlayerName(data.user.playerName || '')
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Enregistrement impossible')
      setUser(data.user)
      setPlayerName(data.user.playerName)
      setSaved(true)
      onSaved()
      window.setTimeout(onClose, 900)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const form = new FormData()
    form.append('avatar', file)
    try {
      const response = await fetch('/api/auth/avatar', { method: 'POST', body: form })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Upload impossible')
      setUser(data.user)
      onSaved()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.location.replace('/')
  }

  return (
    <div className="player-profile-backdrop" role="dialog" aria-modal="true" aria-labelledby="player-profile-title" onMouseDown={onClose}>
      <section className="player-profile-overlay" onMouseDown={(event) => event.stopPropagation()}>
        <button className="player-profile-close" type="button" onClick={onClose} aria-label="Fermer">✕</button>
        <span className="player-profile-rune" aria-hidden="true">ᛉ</span>
        <p className="player-profile-kicker">Identité du guerrier</p>
        <h2 id="player-profile-title">Mon profil</h2>

        {loading && <p className="player-profile-loading">Chargement du profil...</p>}
        {!loading && user && (
          <>
            <div className="player-profile-avatar">
              <img src={user.avatarUrl || '/favicon.png'} alt="" referrerPolicy="no-referrer" />
              <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}>{uploading ? 'Upload...' : 'Changer la photo'}</button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={uploadAvatar} />
            </div>
            <div className="player-profile-google">
              <span><strong>{user.name}</strong><small>{user.email}</small></span>
            </div>
            <form onSubmit={save}>
              <label htmlFor="player-profile-name">Pseudo du personnage en jeu</label>
              <input id="player-profile-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} minLength="2" maxLength="64" autoComplete="off" required autoFocus />
              <p className="player-profile-warning"><strong>Important :</strong> le pseudo saisi doit correspondre exactement au nom de ton personnage en jeu. C&rsquo;est à ce personnage que les récompenses de la Roue du Valhalla seront livrées.</p>
              <button className="player-profile-save" type="submit" disabled={saving}>{saving ? 'Enregistrement...' : saved ? 'Pseudo enregistré' : 'Enregistrer mon pseudo'}</button>
            </form>
            {user.role === 'admin' && <button className="player-profile-admin" type="button" onClick={() => window.location.href = '/admin/valhalla'}>ᛟ Administration</button>}
            <button className="player-profile-logout" type="button" onClick={logout}>Se déconnecter</button>
          </>
        )}
        {error && <p className="player-profile-error" role="alert">{error}</p>}
      </section>
    </div>
  )
}

PlayerProfileOverlay.propTypes = { onClose: PropTypes.func.isRequired, onSaved: PropTypes.func.isRequired }
