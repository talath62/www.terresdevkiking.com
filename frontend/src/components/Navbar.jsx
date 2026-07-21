import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  ['/', 'Accueil'],
  ['/notre-communaute-viking-valheim', 'Communauté'],
  ['/captures-decran', 'Galerie'],
  ['/fonctionnalites-valheim-viking', 'Le monde'],
  ['/evenements-valheim-viking', 'Évènements'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
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
          <Link to="/nous-rejoindre" className="nav-cta" onClick={() => setOpen(false)}>Nous rejoindre <span>↗</span></Link>
        </nav>
      </div>
    </header>
  )
}
