import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Navbar.css'

const links = [
  ['/', 'Accueil'],
  ['/notre-communaute-viking-valheim', 'Communauté'],
  ['/captures-decran', 'Galerie'],
  ['/fonctionnalites-valheim-viking', 'Le monde'],
  ['/evenements-valheim-viking', 'Évènements'],
  ['/videos', 'Vidéos'],
]

export default function Navbar({ onOpenGifts, onOpenProfile }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => setAuthUser(data.authenticated ? data.user : null))
      .catch(() => setAuthUser(null))
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" aria-label="Terres de Viking - Accueil">
          <span className="logo-mark"><img src="/terres-de-viking-logo.webp" alt="" /></span>
          <span className="logo-copy"><span>Terres</span> <i>de</i> <span>Viking</span></span>
        </Link>

        <button className={`nav-toggle ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Ouvrir le menu" aria-expanded={open}>
          <span /><span /><span />
        </button>

        <nav className={`nav-menu ${open ? 'active' : ''}`} aria-label="Navigation principale">
          <ul className="nav-links">
            {links.map(([to, label]) => (
              <li key={to}><NavLink to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink></li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link to="/nous-rejoindre" className="nav-cta" onClick={() => setOpen(false)}>Nous rejoindre <span>↗</span></Link>
            <button className="nav-gifts" type="button" onClick={() => { setOpen(false); onOpenGifts() }}>🎁</button>
            {authUser ? (
              <button className="nav-auth is-connected" type="button" onClick={() => { setOpen(false); onOpenProfile() }} title="Ouvrir mon profil">
                {authUser.avatarUrl && <img src={authUser.avatarUrl} alt="" referrerPolicy="no-referrer" />}
                <span>{authUser.playerName || authUser.name}</span>
              </button>
            ) : <a className="nav-auth" href="/api/auth/google" onClick={() => setOpen(false)}>Connexion</a>}
          </div>
        </nav>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  onOpenGifts: PropTypes.func.isRequired,
  onOpenProfile: PropTypes.func.isRequired,
}
