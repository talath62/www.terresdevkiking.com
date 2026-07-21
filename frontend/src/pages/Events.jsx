import '../index.css'

const events = [
  {
    title: 'Autels Mystiques',
    desc: 'Un évènement mystique où des autels anciens apparaissent à travers le monde. Résolvez leurs énigmes pour obtenir des récompenses légendaires.',
    image: '/screenshots/autels-mystiques.webp',
    status: 'En cours',
  },
  {
    title: 'SkollHell – La porte des enfers',
    desc: 'Les portes des enfers se sont ouvertes ! Affrontez les créatures des abysses dans cet évènement épique.',
    status: 'En cours',
  },
  {
    title: 'Le Mausolée de Níðhöggr',
    desc: 'Explorez le mausolée du dragon Níðhöggr et découvrez les secrets enfouis depuis des millénaires.',
    status: 'En cours',
  },
  {
    title: 'Le Fléau des Trois Lunes',
    desc: 'Sous la lueur des trois lunes, des créatures ancestrales se réveillent. Unissez-vous pour les vaincre !',
    status: 'En cours',
  },
]

export default function Events() {
  return (
    <div className="page-shell events-page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Évènements</h2>
          <p className="section-subtitle">
            Des évènements réguliers pour rythmer la vie du serveur et récompenser les aventuriers.
          </p>
          <div className="grid-2">
            {events.map((e, i) => (
              <div key={i} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                overflow: 'hidden',
                transition: 'transform 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {e.image && (
                  <img src={e.image} alt={e.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: 25 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{e.title}</h3>
                    <span style={{
                      background: e.status === 'En cours' ? 'green' : 'var(--text-muted)',
                      color: 'white', padding: '3px 10px', borderRadius: 20,
                      fontSize: '0.75rem', textTransform: 'uppercase',
                    }}>{e.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
