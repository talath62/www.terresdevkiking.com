import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-rune" aria-hidden="true">ᚦ · ᛟ · ᚢ · ᚱ</div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <img className="footer-logo" src="/terres-de-viking-logo.webp" alt="Blason Terres de Viking" />
          <span className="eyebrow">Une saga à vivre</span>
          <h3>Chaque Viking<br />forge son histoire.</h3>
          <p>Un monde Valheim façonné à la main, porté par une communauté francophone passionnée.</p>
        </div>
        <div className="footer-column">
          <h4>Explorer</h4>
          <Link to="/fonctionnalites-valheim-viking">Le monde</Link>
          <Link to="/captures-decran">Galerie</Link>
          <Link to="/evenements-valheim-viking">Évènements</Link>
          <Link to="/regles-du-serveur-valheim">Règles</Link>
        </div>
        <div className="footer-column">
          <h4>Nous suivre</h4>
          <a href="https://discord.com/invite/3K4vbNCZ3Q" target="_blank" rel="noreferrer">Discord ↗</a>
          <a href="https://www.youtube.com/@TerresDeViking-Valheim" target="_blank" rel="noreferrer">YouTube ↗</a>
          <a href="https://www.twitch.tv/terresdeviking" target="_blank" rel="noreferrer">Twitch ↗</a>
          <a href="https://www.facebook.com/TerresdeVikingValheim" target="_blank" rel="noreferrer">Facebook ↗</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Terres de Viking</p>
        <p>Serveur communautaire Valheim francophone</p>
      </div>
    </footer>
  )
}
