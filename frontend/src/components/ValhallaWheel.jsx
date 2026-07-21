import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ValhallaAdmin from './ValhallaAdmin'
import './ValhallaWheel.css'

const WHEEL_COLORS = ['#e7a356', '#c68a38', '#d49545', '#b87a2e', '#a06a22', '#e7a356', '#c68a38', '#d49545', '#b87a2e', '#a06a22']
const RUNES = 'ᚠᚢᚦᚱᛏᛞᚲᚷᚹᚺᚾᛁᛃᛈᛉᛋᛒᛗ'
const FALLING_RUNES = Array.from({ length: 30 }, (_, index) => ({
  rune: RUNES[index % RUNES.length],
  left: (index * 37) % 100,
  delay: (index * 1.7) % 12,
  duration: 8 + (index * 3) % 14,
  size: 14 + (index * 7) % 28,
}))

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

export default function ValhallaWheel({ onClose }) {
  const [wheelState, setWheelState] = useState({ authenticated: false, user: null, rewards: [], configured: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const rotationRef = useRef(0)

  const loadState = async () => {
    try {
      const data = await apiRequest('/api/valhalla/state')
      setWheelState(data)
      setPlayerName(data.user?.playerName || '')
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadState()
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const savePlayerName = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    setError('')
    try {
      const data = await apiRequest('/api/auth/profile', { method: 'PATCH', body: JSON.stringify({ playerName }) })
      setWheelState((current) => ({ ...current, user: data.user }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const spin = async () => {
    if (spinning || !wheelState.user?.tickets || !wheelState.rewards.length) return
    setSpinning(true)
    setResult(null)
    setError('')
    try {
      const data = await apiRequest('/api/valhalla/spin', { method: 'POST' })
      const index = wheelState.rewards.findIndex((reward) => reward.id === data.reward.id)
      const segmentDegrees = 360 / wheelState.rewards.length
      const targetAngle = segmentDegrees * Math.max(index, 0) + segmentDegrees / 2
      const extra = (10 + Math.floor(Math.random() * 5)) * 360
      rotationRef.current += extra + 360 - targetAngle
      setRotation(rotationRef.current)
      setWheelState((current) => ({ ...current, user: { ...current.user, tickets: data.tickets } }))
      window.setTimeout(() => {
        setSpinning(false)
        setResult(data.reward)
        setShowResult(true)
        window.setTimeout(() => setShowResult(false), 5000)
      }, 8200)
    } catch (requestError) {
      setSpinning(false)
      setError(requestError.message)
      loadState()
    }
  }

  const rewards = wheelState.rewards.length ? wheelState.rewards : [{ id: 0, name: '???' }]
  const segments = rewards.length
  const cx = 200
  const cy = 200
  const radius = 176
  const segmentAngle = 360 / segments
  const slices = Array.from({ length: segments }, (_, index) => {
    const start = (index * segmentAngle - 90) * Math.PI / 180
    const end = ((index + 1) * segmentAngle - 90) * Math.PI / 180
    const x1 = cx + radius * Math.cos(start)
    const y1 = cy + radius * Math.sin(start)
    const x2 = cx + radius * Math.cos(end)
    const y2 = cy + radius * Math.sin(end)
    const large = segmentAngle > 180 ? 1 : 0
    return `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${radius},${radius} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`
  })

  return (
    <div className="gift-overlay-backdrop" role="dialog" aria-modal="true" aria-labelledby="valhalla-wheel-title" onMouseDown={onClose}>
      <div className="falling-runes-container" aria-hidden="true">
        {FALLING_RUNES.map((rune, index) => <span key={index} className="falling-rune" style={{ left: `${rune.left}%`, animationDelay: `${rune.delay}s`, animationDuration: `${rune.duration}s`, fontSize: `${rune.size}px` }}>{rune.rune}</span>)}
      </div>

      <div className="wheel-overlay" onMouseDown={(event) => event.stopPropagation()}>
        <button className="gift-overlay-close" type="button" onClick={onClose} aria-label="Fermer la roue">✕</button>
        <h2 className="wheel-title" id="valhalla-wheel-title">ᚱᛟᚢᛖ ᛞᚢ ᚢᚨᛚᚺᚨᛚᛚᚨ</h2>

        <div className="wheel-container">
          <div className="wheel-pointer"><span className="wheel-pointer-glow" /></div>
          <div className="wheel-spinner" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 8s cubic-bezier(0.08, 0.72, 0.08, 1)' : 'none' }}>
            <svg viewBox="0 0 400 400" className="wheel-svg" aria-label="Roue du Valhalla">
              <defs><radialGradient id="wheel-glow-outer" cx="50%" cy="50%" r="50%"><stop offset="85%" stopColor="transparent" /><stop offset="100%" stopColor="rgba(231,163,86,0.12)" /></radialGradient></defs>
              <circle cx={cx} cy={cy} r={radius + 6} fill="none" stroke="rgba(231,163,86,0.12)" />
              <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="rgba(231,163,86,0.06)" strokeWidth=".5" strokeDasharray="2,6" />
              {Array.from({ length: 24 }, (_, index) => {
                const angle = index * 15 * Math.PI / 180
                return <text key={index} x={cx + (radius + 5) * Math.cos(angle)} y={cy + (radius + 5) * Math.sin(angle)} textAnchor="middle" dominantBaseline="central" fill="rgba(231,163,86,0.15)" fontSize="9">{RUNES[index % RUNES.length]}</text>
              })}
              <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="#e7a356" strokeWidth="1.5" opacity=".35" />
              {slices.map((path, index) => <path key={index} d={path} fill={WHEEL_COLORS[index % WHEEL_COLORS.length]} stroke="#ffcd76" strokeWidth="1.2" />)}
              {rewards.map((reward, index) => {
                const middle = (index + .5) * segmentAngle
                const angle = (middle - 90) * Math.PI / 180
                const x = cx + radius * .6 * Math.cos(angle)
                const y = cy + radius * .6 * Math.sin(angle)
                const fontSize = segments <= 5 ? 22 : segments <= 8 ? 16 : segments <= 12 ? 14 : 11
                return <text key={reward.id} x={x} y={y} transform={`rotate(${middle - 90}, ${x}, ${y})`} textAnchor="middle" dominantBaseline="central" fill="#ffcd76" stroke="#101315" strokeWidth="3" paintOrder="stroke" fontSize={fontSize} fontWeight="bold">{reward.name.substring(0, 30)}</text>
              })}
              <circle cx={cx} cy={cy} r="34" fill="#101315" stroke="#e7a356" strokeWidth="1.5" opacity=".9" />
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="rgba(231,163,86,0.3)" />
              <circle cx={cx} cy={cy} r="14" fill="rgba(231,163,86,0.08)" />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="#ffcd76" fontSize="22" fontWeight="bold">ᚠ</text>
              <circle cx={cx} cy={cy} r={radius + 4} fill="url(#wheel-glow-outer)" pointerEvents="none" />
            </svg>
          </div>
          <svg viewBox="0 0 400 400" className="wheel-svg wheel-outer-runes" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 8s cubic-bezier(0.08, 0.72, 0.08, 1)' : 'none' }} aria-hidden="true">
            {Array.from({ length: segments }, (_, index) => {
              const middle = (index + .5) * segmentAngle
              const angle = (middle - 90) * Math.PI / 180
              const x = cx + (radius + 14) * Math.cos(angle)
              const y = cy + (radius + 14) * Math.sin(angle)
              return <text key={index} x={x} y={y} transform={`rotate(${middle - 90}, ${x}, ${y})`} textAnchor="middle" dominantBaseline="central" fill="#ffeecc" fontSize="20" fontWeight="bold">{RUNES[index % RUNES.length]}</text>
            })}
          </svg>
        </div>

        <p className="wheel-subtitle">Que le Père-de-Tout guide ta création : chaque ticket déverrouille un fragment de ses trésors oubliés.</p>
        {loading && <p className="wheel-status">Invocation de la roue...</p>}
        {!loading && !wheelState.authenticated && <p className="wheel-login-required">Connecte-toi depuis le header pour accéder à tes tickets et lancer la roue.</p>}
        {wheelState.authenticated && !wheelState.user.playerName && (
          <form className="wheel-profile" onSubmit={savePlayerName}>
            <label htmlFor="valhalla-player">Nom exact du personnage Valheim</label>
            <div><input id="valhalla-player" value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength="64" required /><button type="submit" disabled={savingProfile}>Valider</button></div>
          </form>
        )}
        {wheelState.authenticated && wheelState.user.playerName && (
          <>
            <div className="wheel-account">
              <img src={wheelState.user.avatarUrl} alt="" referrerPolicy="no-referrer" />
              <span><strong>{wheelState.user.playerName}</strong><small>{wheelState.user.tickets} ticket{wheelState.user.tickets > 1 ? 's' : ''} vers le Valhalla</small></span>
              {wheelState.user.role === 'admin' && <button type="button" onClick={() => setShowAdmin(true)}>Administration</button>}
            </div>
            <button className="wheel-btn" type="button" disabled={spinning || !wheelState.configured || !wheelState.rewards.length || wheelState.user.tickets < 1} onClick={spin}>
              {spinning ? 'ᚱᚢᛚᛖ ᛏᚢᚱᚾᛖ...' : wheelState.user.tickets < 1 ? 'ᚲ Aucun ticket' : !wheelState.configured ? 'Livraison non configurée' : !wheelState.rewards.length ? 'Aucune récompense' : '⚔ Lancer la Roue du Valhalla ⚔'}
            </button>
          </>
        )}
        {error && <p className="wheel-error" role="alert">{error}</p>}
      </div>

      {showResult && result && <div className="reward-overlay"><div className="reward-overlay-content"><div className="reward-runes">ᚱ ᛖ ᚲ ᛟ ᛗ ᛈ ᛖ ᚾ ᛋ ᛖ</div><div className="reward-name">{result.name}</div><div className="reward-skjoldheim"><span>ᛉ</span><span>Récompense livrée par Odin,<br />à récupérer à Skjoldheim.</span></div></div></div>}
      {showAdmin && <ValhallaAdmin onClose={() => { setShowAdmin(false); loadState() }} apiRequest={apiRequest} />}
    </div>
  )
}

ValhallaWheel.propTypes = { onClose: PropTypes.func.isRequired }
