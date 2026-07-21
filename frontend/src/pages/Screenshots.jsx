import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import '../index.css'

const images = [
  { src: '/screenshots/citadelle.webp', title: 'Citadelle Sombre' },
  { src: '/screenshots/fjornheim.webp', title: 'Port de Fjornheim' },
  { src: '/screenshots/lyanore.webp', title: 'Village de Lyanore' },
  { src: '/screenshots/brumecoeur.webp', title: 'Forteresse Brumecœur' },
  { src: '/screenshots/valkyries.webp', title: 'Plage des Valkyries' },
  { src: '/screenshots/pic-du-loup.webp', title: 'Pic du Loup' },
  { src: '/screenshots/village.webp', title: 'Village Terres de Viking' },
  { src: '/screenshots/eikthyr.webp', title: 'Eikthyr' },
  { src: '/screenshots/baie-corbeau.webp', title: 'Baie du Corbeau' },
  { src: '/screenshots/marais.webp', title: 'Marais oublié' },
]

export default function Screenshots() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  return (
    <div className="page-shell gallery-page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Captures d'écran</h2>
          <p className="section-subtitle">
            Découvrez les magnifiques paysages et constructions de notre serveur.
          </p>
          <div className="grid-3">
            {images.map((img, i) => (
              <button type="button" className="screenshot-button" key={img.src} onClick={() => setLightboxIndex(i)} aria-label={`Agrandir ${img.title}`}>
                <div style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.3s, border-color 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <img src={img.src} alt={img.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 10, background: 'var(--dark-3)', textAlign: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{img.title}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <Lightbox images={images} current={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
    </div>
  )
}
