import { Link } from 'react-router-dom'
import './Footer.css'

const socials = [
  { name: 'Discord', icon: 'discord', href: 'https://discord.com/invite/3K4vbNCZ3Q' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/terres_de_viking_valheim/' },
  { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@TerresDeViking-Valheim' },
  { name: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@terres.de.viking' },
  { name: 'Twitch', icon: 'twitch', href: 'https://www.twitch.tv/terresdeviking' },
  { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/TerresdeVikingValheim' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <svg className="social-sprite" aria-hidden="true">
        <symbol id="social-discord" viewBox="0 0 24 24"><path d="M19.5 5.35A17.4 17.4 0 0 0 15.2 4l-.55 1.1a15.7 15.7 0 0 0-5.3 0L8.8 4a17.3 17.3 0 0 0-4.3 1.36C1.78 9.4 1.04 13.34 1.4 17.22a17.6 17.6 0 0 0 5.27 2.66l1.28-1.76a11.3 11.3 0 0 1-2.02-.98l.5-.38c3.9 1.8 8.13 1.8 11.98 0l.51.38c-.65.38-1.33.7-2.03.98l1.28 1.76a17.5 17.5 0 0 0 5.27-2.66c.43-4.5-.74-8.4-3.94-11.87ZM8.66 14.8c-1.17 0-2.13-1.08-2.13-2.4s.94-2.4 2.13-2.4c1.2 0 2.15 1.09 2.13 2.4 0 1.32-.94 2.4-2.13 2.4Zm6.68 0c-1.17 0-2.13-1.08-2.13-2.4s.94-2.4 2.13-2.4c1.2 0 2.15 1.09 2.13 2.4 0 1.32-.93 2.4-2.13 2.4Z" /></symbol>
        <symbol id="social-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.7" r="1.2" /></symbol>
        <symbol id="social-youtube" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.55 3.6 12 3.6 12 3.6s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.9 12l-6.3 3.6Z" /></symbol>
        <symbol id="social-tiktok" viewBox="0 0 24 24"><path d="M17.7 1.5h-4.1v14.2a3.4 3.4 0 1 1-2.9-3.36V8.2a7.5 7.5 0 1 0 7 7.48V8.5a9.4 9.4 0 0 0 5.5 1.76V6.15a5.5 5.5 0 0 1-5.5-4.65Z" /></symbol>
        <symbol id="social-twitch" viewBox="0 0 24 24"><path d="M2 1 0 6.2V21h5v3h3l3-3h4l7-7V1H2Zm18 12-4 4h-5l-3 3v-3H4V3h16v10Zm-4-7h-2v6h2V6Zm-5 0H9v6h2V6Z" /></symbol>
        <symbol id="social-facebook" viewBox="0 0 24 24"><path d="M14.2 24v-10h3.35l.5-3.9H14.2V7.62c0-1.13.31-1.9 1.93-1.9h2.06V2.24A27.7 27.7 0 0 0 15.2 2c-2.96 0-4.98 1.8-4.98 5.13v2.86H6.88v3.9h3.34V24h3.98Z" /></symbol>
      </svg>
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
          <Link to="/videos">Vidéos</Link>
          <Link to="/regles-du-serveur-valheim">Règles</Link>
        </div>
        <div className="footer-column footer-social">
          <h4>Nous suivre</h4>
          <p>Suivez les aventures du royaume, les créations et les prochains évènements.</p>
          <div className="social-grid">
            {socials.map((social) => (
              <a className={`social-link social-${social.icon}`} href={social.href} target="_blank" rel="noreferrer" key={social.name} aria-label={`Terres de Viking sur ${social.name}`}>
                <svg aria-hidden="true"><use href={`#social-${social.icon}`} /></svg>
                <span>{social.name}</span>
                <i>↗</i>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Terres de Viking</p>
        <p>Serveur communautaire Valheim francophone</p>
      </div>
    </footer>
  )
}
