import '../index.css'

export default function Join() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Nous rejoindre</h2>
          <p className="section-subtitle">
            Prêt à embarquer pour l'aventure ? Voici comment rejoindre notre serveur Valheim.
          </p>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30, marginBottom: 20 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>1. Rejoins le Discord</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                La première étape est de rejoindre notre serveur Discord. C'est là que tout se passe :
                annonces, inscriptions, support et bonne humeur !
              </p>
              <a href="https://discord.com/invite/3K4vbNCZ3Q" target="_blank" rel="noreferrer" className="btn" style={{ marginTop: 15 }}>
                Rejoindre le Discord
              </a>
            </div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30, marginBottom: 20 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>2. Soumets ta candidature</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Remplis le formulaire de candidature dans Discord. Un membre de notre staff
                te contactera rapidement pour valider ton inscription.
              </p>
            </div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>3. Connecte-toi !</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Une fois accepté, tu recevras l'adresse IP du serveur et le mot de passe.
                Lance Valheim, connecte-toi et commence ton aventure parmi les Vikings !
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
