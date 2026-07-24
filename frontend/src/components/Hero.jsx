import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const background = '/screenshots/fjornheim.webp'

export default function Hero() {
  const [stats, setStats] = useState({ playersOnline: 0, maxPlayers: 50, status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/stats', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setStats)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${background})` }} />
      <div className="hero-shade" />
      <img className="hero-crest" src="/terres-de-viking-logo.webp" alt="" aria-hidden="true" fetchpriority="high" />
      <div className="hero-runes" aria-hidden="true">ᚠ ᛟ ᚱ ᚷ ᛖ</div>

      <div className="container hero-layout">
        <div className="hero-content">
          <span className="hero-kicker"><i /> Serveur Valheim francophone</span>
          <h1>Écris ta saga.<br /><em>Conquiers le Nord.</em></h1>
          <p>Une terre façonnée à la main, des quêtes inédites et une communauté soudée. Ici, chaque expédition devient une légende.</p>
          <div className="hero-buttons">
            <Link to="/nous-rejoindre" className="btn">Commencer l'aventure <span className="btn-arrow">→</span></Link>
            <Link to="/captures-decran" className="btn btn-outline">Découvrir le monde</Link>
          </div>
        </div>

        <aside className="server-card">
          <div className="server-card-head">
            <span>État du royaume</span>
            <span className={`live ${stats.status}`}><i /> {stats.status === 'loading' ? 'Connexion' : stats.status === 'online' ? 'En ligne' : 'Hors ligne'}</span>
          </div>
          <div className="server-count">
            <strong>{stats.playersOnline}</strong><span>/ {stats.maxPlayers}</span>
          </div>
          <p>Vikings actuellement connectés</p>
          <div className="server-progress"><span style={{ width: `${(stats.playersOnline / stats.maxPlayers) * 100}%` }} /></div>
          <a href="https://discord.com/invite/3K4vbNCZ3Q" target="_blank" rel="noreferrer">Rejoindre notre Discord <span>↗</span></a>
        </aside>
      </div>

      <div className="hero-foot container">
        <span>01</span><i /><p>Fjornheim, porte des héros</p>
      </div>
    </section>
  )
}
