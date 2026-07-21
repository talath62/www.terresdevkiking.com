import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
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
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const rotationRef = useRef(0)
  const containerRef = useRef(null)

  const loadState = async () => {
    try {
      const data = await apiRequest('/api/valhalla/state')
      setWheelState(data)
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
  const radius = 185
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

        <div className="wheel-container" ref={containerRef}>
          <div className="wheel-pointer"><span className="wheel-pointer-glow" /></div>
          <div className="wheel-spinner" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 8s cubic-bezier(0.08, 0.72, 0.08, 1)' : 'none' }}>
            <svg viewBox="0 0 400 400" className="wheel-svg" aria-label="Roue du Valhalla">
              <defs>
                <radialGradient id="wheel-glow-outer" cx="50%" cy="50%" r="50%"><stop offset="85%" stopColor="transparent" /><stop offset="100%" stopColor="rgba(231,163,86,0.12)" /></radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r={radius + 24} fill="#0d0a08" opacity="0.55" />
              <circle cx={cx} cy={cy} r={radius + 20} fill="none" stroke="rgba(231,163,86,0.12)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={radius + 24} fill="none" stroke="rgba(231,163,86,0.06)" strokeWidth="0.5" strokeDasharray="2,6" />
              <circle cx={cx} cy={cy} r={radius + 2} fill="none" stroke="#e7a356" strokeWidth="1.5" opacity="0.35" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = i * 15 * Math.PI / 180
                return <text key={`or-${i}`} x={cx + (radius + 9) * Math.cos(a)} y={cy + (radius + 9) * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="rgba(231,163,86,0.15)" fontSize="9" fontFamily="Norse, serif">{RUNES[i % RUNES.length]}</text>
              })}
              <circle cx={cx} cy={cy} r={radius + 3} fill="url(#wheel-glow-inner)" pointerEvents="none" />
              {slices.map((d, i) => <path key={i} d={d} fill={WHEEL_COLORS[i % WHEEL_COLORS.length]} stroke="#ffcd76" strokeWidth="1.2" opacity="1" />)}
              {Array.from({ length: 24 }).map((_, i) => {
                const a = i * 15 * Math.PI / 180
                return <circle key={`dt-${i}`} cx={cx + (radius - 18) * Math.cos(a)} cy={cy + (radius - 18) * Math.sin(a)} r="1.2" fill="rgba(231,163,86,0.2)" />
              })}
              {rewards.map((reward, i) => {
                const mid = (i + 0.5) * segmentAngle
                const rad = (mid - 90) * Math.PI / 180
                const tx = cx + (radius * 0.55 - 5) * Math.cos(rad), ty = cy + (radius * 0.55 - 5) * Math.sin(rad)
                const label = reward.name.substring(0, 30)
                const fs = segments <= 5 ? 20 : segments <= 8 ? 14 : segments <= 12 ? 12 : 10
                return <g key={reward.id} transform={`rotate(${mid - 90}, ${tx}, ${ty})`}>
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill="#101315" stroke="#101315" strokeWidth="3.5" strokeLinejoin="round" fontSize={fs} fontFamily="Norse, serif" fontWeight="bold" opacity="0.55">{label}</text>
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill="#ffcd76" fontSize={fs} fontFamily="Norse, serif" fontWeight="bold">{label}</text>
                </g>
              })}
              <circle cx={cx} cy={cy} r="34" fill="#101315" stroke="#e7a356" strokeWidth="1.5" opacity="0.6" />
              <circle cx={cx} cy={cy} r="28" fill="none" stroke="rgba(231,163,86,0.2)" strokeWidth="0.5" strokeDasharray="3,3" />
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="rgba(231,163,86,0.3)" strokeWidth="1" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = i * 45 * Math.PI / 180
                return <circle key={`hb-${i}`} cx={cx + 24 * Math.cos(a)} cy={cy + 24 * Math.sin(a)} r="1.5" fill="rgba(255,205,118,0.3)" />
              })}
              <circle cx={cx} cy={cy} r="14" fill="rgba(231,163,86,0.08)" />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="#ffcd76" fontSize="22" fontFamily="Norse, serif" fontWeight="bold">ᚠ</text>
              <circle cx={cx} cy={cy} r={radius + 24} fill="url(#wheel-glow-outer)" pointerEvents="none" />
            </svg>
          </div>
          <svg viewBox="0 0 400 400" className="wheel-svg" style={{ position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 8s cubic-bezier(0.08, 0.72, 0.08, 1)' : 'none', pointerEvents: 'none' }} aria-hidden="true">
            <defs>
              <filter id="rune-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset dx="0" dy="0" />
                <feFlood floodColor="#ffcd76" floodOpacity="0.3" />
                <feComposite in2="blur" operator="in" result="glowColored" />
                <feMerge>
                  <feMergeNode in="glowColored" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {Array.from({ length: segments }).map((_, i) => {
              const mid = (i + 0.5) * segmentAngle
              const rad = (mid - 90) * Math.PI / 180
              const rx = cx + (radius + 9) * Math.cos(rad)
              const ry = cy + (radius + 9) * Math.sin(rad)
              return <g key={`outer-rune-${i}`} transform={`rotate(${mid - 90}, ${rx}, ${ry})`}>
                <text x={rx} y={ry} textAnchor="middle" dominantBaseline="central" fill="#ffeecc" fontSize="20" fontFamily="Norse, serif" fontWeight="bold" opacity="0.9" filter="url(#rune-glow)">
                  {RUNES[i % RUNES.length]}
                </text>
              </g>
            })}
          </svg>
        </div>

        <p className="wheel-subtitle">Que le Père-de-Tout guide ton aventure : chaque ticket déverrouille un fragment de ses trésors oubliés.</p>
        {loading && <p className="wheel-status">Invocation de la roue...</p>}
        {!loading && !wheelState.authenticated && <p className="wheel-login-required">Connecte-toi pour accéder à tes tickets et lancer la roue.</p>}
        {!loading && wheelState.authenticated && !wheelState.user.playerName && <p className="wheel-login-required">Configure ton pseudo dans ton profil pour lancer la roue.</p>}
        {wheelState.authenticated && wheelState.user.playerName && (
          <>
            <div className="wheel-account">
              <img src={wheelState.user.avatarUrl} alt="" referrerPolicy="no-referrer" />
              <span><strong>{wheelState.user.playerName}</strong><small>{wheelState.user.tickets} ticket{wheelState.user.tickets > 1 ? 's' : ''} vers le Valhalla</small></span>
            </div>
            <button className="wheel-btn" type="button" disabled={spinning || !wheelState.configured || !wheelState.rewards.length || wheelState.user.tickets < 1} onClick={spin}>
              {spinning ? 'ᚱᚢᛚᛖ ᛏᚢᚱᚾᛖ...' : wheelState.user.tickets < 1 ? 'ᚲ Aucun ticket' : !wheelState.configured ? 'Livraison non configurée' : !wheelState.rewards.length ? 'Aucune récompense' : '⚔ Lancer la Roue du Valhalla ⚔'}
            </button>
          </>
        )}
        {error && <p className="wheel-error" role="alert">{error}</p>}
      </div>

      {showResult && result && <div className="reward-overlay"><div className="reward-overlay-content"><div className="reward-runes">ᚱ ᛖ ᚲ ᛟ ᛗ ᛈ ᛖ ᚾ ᛋ ᛖ</div><div className="reward-name">{result.name}</div><div className="reward-skjoldheim"><span>ᛉ</span><span>Récompense livrée par Odin,<br />à récupérer à Skjoldheim.</span></div></div></div>}
    </div>
  )
}

ValhallaWheel.propTypes = { onClose: PropTypes.func.isRequired }
