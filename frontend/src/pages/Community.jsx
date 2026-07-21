import '../index.css'

export default function Community() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Notre Communauté</h2>
          <p className="section-subtitle">
            Rejoins une communauté de passionnés, où l'entraide et la bonne humeur sont les maîtres-mots.
          </p>
          <div className="grid-2">
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Une communauté active</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Avec des joueurs connectés quotidiennement, notre serveur ne dort jamais.
                Que tu sois un bâtisseur solitaire ou un aventurier en groupe, tu trouveras
                toujours quelqu'un avec qui partager ton aventure.
              </p>
            </div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Des évènements réguliers</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Tournois, chasses au trésor, constructions collaboratives... Notre équipe organise
                régulièrement des évènements pour rythmer la vie du serveur et récompenser les plus méritants.
              </p>
            </div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Des guildes organisées</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Rejoins une guilde comme Les Enfants d'Odin ou Les Ombres Anciennes,
                ou crée la tienne ! Les guildes organisent des expéditions, des défis et
                participent à la vie politique du serveur.
              </p>
            </div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Un staff à l'écoute</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Notre équipe de modération est disponible et réactive pour garantir
                une expérience de jeu agréable pour tous. N'hésite pas à les solliciter
                en cas de besoin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
