import '../index.css'

const rules = [
  { title: 'Respect et courtoisie', desc: 'Tous les joueurs doivent se traiter avec respect. Les insultes, le harcèlement et la discrimination sont strictement interdits.' },
  { title: 'Pas de triche', desc: 'L\'utilisation de cheats, mods non autorisés ou exploits est interdite. Tout joueur pris en flagrant délit sera banni.' },
  { title: 'Respect des constructions', desc: 'Ne détruisez pas les constructions des autres joueurs. Le griefing est passible d\'un bannissement immédiat.' },
  { title: 'Pas de spam', desc: 'Évitez le spam sur le chat du jeu et sur Discord. Utilisez les salons appropriés pour vos discussions.' },
  { title: 'Participer à la communauté', desc: 'Nous encourageons tous les joueurs à participer à la vie du serveur : évènements, constructions collectives, etc.' },
  { title: 'Signaler les problèmes', desc: 'Si vous rencontrez un problème ou un joueur ne respectant pas les règles, contactez un membre du staff.' },
]

export default function Rules() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Règles du serveur</h2>
          <p className="section-subtitle">
            Pour garantir une expérience agréable à tous, merci de respecter ces règles simples.
          </p>
          <div className="grid-2">
            {rules.map((r, i) => (
              <div key={i} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 25,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--primary)', color: 'var(--dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Cinzel', fontWeight: 700, fontSize: '0.9rem',
                  }}>{i + 1}</span>
                  <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{r.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
