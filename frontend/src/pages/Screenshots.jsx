import { useState, useMemo } from 'react'
import Lightbox from '../components/Lightbox'
import '../index.css'

const categories = [
  {
    id: 'captures',
    label: 'Captures d\'écran',
    images: [
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
    ],
  },
  {
    id: 'clans',
    label: 'Clans Vikings',
    images: [
      { src: '/clans/anniversaire.webp', title: 'Anniversaire' },
      { src: '/clans/anniversaire1.webp', title: 'Anniversaire (1)' },
      { src: '/clans/anniversaire2.webp', title: 'Anniversaire (2)' },
      { src: '/clans/auteleitkhyr.webp', title: 'Autel d\'Eikthyr' },
      { src: '/clans/chasseautresor.webp', title: 'Chasse au Trésor' },
      { src: '/clans/chasseautresor2.webp', title: 'Chasse au Trésor (2)' },
      { src: '/clans/clanpicduloup.webp', title: 'Clan du Pic du Loup' },
      { src: '/clans/clanstormvik.webp', title: 'Clan Stormvik' },
      { src: '/clans/epreuvesdadresses.webp', title: 'Épreuves d\'Adresse' },
      { src: '/clans/festinpicduloup.webp', title: 'Festin du Pic du Loup' },
      { src: '/clans/fildeleau.webp', title: 'Fil de l\'Eau' },
      { src: '/clans/lesenfantsdodin.webp', title: 'Les Enfants d\'Odin' },
      { src: '/clans/nightclub.webp', title: 'Night Club' },
      { src: '/clans/ouvertureevent.webp', title: 'Ouverture d\'Évènement' },
      { src: '/clans/maisondesdieux.webp', title: 'Maison des Dieux' },
      { src: '/clans/rassemblementskjoldheim.webp', title: 'Rassemblement à Skjoldheim' },
    ],
  },
  {
    id: 'concours',
    label: 'Concours communautaires',
    images: [
      { src: '/concours/crocsdefenris.webp', title: 'Crocs de Fenris' },
      { src: '/concours/dragonfoudresdethor.webp', title: 'Dragon des Foudres de Thor' },
      { src: '/concours/foudresdethor.webp', title: 'Foudres de Thor' },
      { src: '/concours/hachedespoulpes.webp', title: 'Hache des Poulpes' },
      { src: '/concours/livredespoulpes.webp', title: 'Livre des Poulpes' },
      { src: '/concours/porteodin.webp', title: 'Porte d\'Odin' },
    ],
  },
]

export default function Screenshots() {
  const [activeTab, setActiveTab] = useState('captures')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const currentCategory = useMemo(() => categories.find((c) => c.id === activeTab), [activeTab])
  const images = currentCategory?.images || []

  return (
    <div className="page-shell gallery-page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Galerie</h2>
          <p className="section-subtitle">
            Découvrez les magnifiques paysages et constructions de notre serveur.
          </p>

          <div className="gallery-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`gallery-tab ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(cat.id); setLightboxIndex(null) }}
              >
                {cat.label}
                {cat.images.length > 0 && <span className="gallery-tab-count">{cat.images.length}</span>}
              </button>
            ))}
          </div>

          {images.length > 0 ? (
            <div className="grid-3">
              {images.map((img, i) => (
                <button type="button" className="screenshot-button" key={img.src} onClick={() => setLightboxIndex(i)} aria-label={`Agrandir ${img.title}`}>
                  <div>
                    <img src={img.src} alt={img.title} />
                    <div><span>{img.title}</span></div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <span className="gallery-empty-rune">ᛉ</span>
              <p>Aucune image pour le moment.<br />Les prochains concours communautaires seront exposés ici.</p>
            </div>
          )}
        </div>
      </section>
      <Lightbox images={images} current={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
    </div>
  )
}
