import { Link } from 'react-router-dom'
import '../index.css'

const features = [
  {
    icon: '🗺️',
    title: 'Carte étendue',
    desc: 'Notre carte est considérablement plus grande que l\'originale, offrant un vaste territoire à explorer. De nouveaux biomes, des îles mystérieuses et des terres inconnues vous attendent.',
  },
  {
    icon: '⚔️',
    title: 'Équipements supplémentaires',
    desc: 'De nombreuses armes, armures et outils supplémentaires viennent diversifier les styles de combat et de survie. Forgez votre légende avec un équipement unique.',
  },
  {
    icon: '👹',
    title: 'Monstres & boss inédits',
    desc: 'Des créatures redoutables et des boss exclusifs peuplent notre monde. Chaque rencontre est un défi qui mettra vos compétences à l\'épreuve.',
  },
  {
    icon: '🏰',
    title: 'Lieux exclusifs scénarisés',
    desc: 'Des constructions grandioses pensées pour l\'exploration et l\'immersion. La forteresse du Pic du Loup, la Baie du Corbeau, les sanctuaires perdus d\'Urmorok... Chaque lieu raconte une histoire.',
  },
  {
    icon: '📜',
    title: 'PNJ et quêtes',
    desc: 'Nos lieux sont peuplés de PNJ interactifs avec leurs propres dialogues, quêtes et secrets. Chaque recoin a été travaillé à la main.',
  },
  {
    icon: '🎉',
    title: 'Évènements réguliers',
    desc: 'Notre équipe organise des évènements réguliers : chasses au trésor, tournois, constructions collectives et défis en tout genre.',
  },
  {
    icon: '🌾',
    title: 'Système de saison',
    desc: 'Le monde évolue au fil des saisons, chacune apportant son lot de changements, de ressources uniques et d\'évènements saisonniers. L\'hiver rend les voyages plus périlleux, le printemps réveille la nature, l\'été offre des récoltes abondantes et l\'automne prépare le monde pour les mois froids.',
  },
  {
    icon: '🤝',
    title: 'Guildes',
    desc: 'Rejoignez ou créez votre guilde. Les Enfants d\'Odin, Les Ombres Anciennes... Chaque guilde a sa propre histoire et ses objectifs.',
  },
]

export default function FeaturesPage() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Fonctionnalités</h2>
          <p className="section-subtitle">
            Terres de Viking propose une expérience enrichie avec du contenu exclusif et des systèmes uniques.
          </p>
          <div className="grid-2">
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 30,
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                transition: 'transform 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: 8, fontSize: '1.15rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/nous-rejoindre" className="btn">
              Rejoindre l'aventure
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
