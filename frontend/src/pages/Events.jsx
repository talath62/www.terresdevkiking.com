import '../index.css'
import './Events.css'

const events = [
  {
    title: 'La Ruche d\'Yggdrasil',
    image: '/evenement/ruche-yggdrasil.webp',
    badge: 'Nouvel évènement',
    tagline: 'Marché aux reines',
    description: 'Au pied de l\'arbre-monde, une ruche géante est apparue, pulse d\'une énergie ancienne. Les abeilles d\'Yggdrasil transportent un miel aux propriétés légendaires, mais seules les reines les plus pures peuvent perpétuer cette lignée.',
    features: [
      'Achetez vos reines abeilles auprès des marchands du royaume',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'Le Pacte des Flots',
    image: '/evenement/pacte-flots.webp',
    badge: 'Nouvel évènement',
    tagline: 'Batailles navales',
    description: 'Des batailles navales en équipe dans un lieu unique où seuls les plus vaillants s\'en sortiront. Formez votre équipage, hissez les voiles et affrontez vos adversaires au cœur des flots déchaînés.',
    features: [
      'Affrontez d\'autres équipages dans des batailles navales en équipe',
      'Pilotez votre drakkar à travers un lieu unique façonné pour le combat naval',
      'Seuls les plus vaillants et les mieux organisés survivront à ces eaux hostiles',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'Arène des Couronnes',
    image: '/evenement/arene-couronnes.webp',
    badge: 'Nouvel évènement',
    tagline: 'Épreuves de courage',
    description: 'Des épreuves de courage contre des monstres, taillées pour les groupes et les clans. Chaque épreuve peut être fatale, mais les récompenses à la clé sont à la hauteur du risque.',
    features: [
      'Affrontez des monstres redoutables dans des épreuves conçues pour les groupes',
      'Relevez les défis en clan pour démontrer votre cohésion et votre courage',
      'Chaque épreuve peut être fatale — seuls les plus valeureux en réchappent',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'La Cage des Gobelins',
    image: '/evenement/cage-gobelins.webp',
    badge: 'Nouvel évènement',
    tagline: 'Arène mortelle',
    description: 'Des vikings capturés par les gobelins sont jetés dans une arène mortelle. Ce jeu gobelin sadique force les prisonniers à s\'entretuer ou à faire basculer leurs compagnons dans la fosse. Seul le plus fort (ou le plus rusé) en réchappera.',
    features: [
      ' Survivre à l\'arène en éliminant vos adversaires ou en les faisant tomber dans la fosse',
      'Les gobelins parient sur les combattants — soyez le dernier debout pour gagner leur respect',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'La Caverne aux Mille Épées',
    image: '/evenement/caverne-mille-epees.webp',
    badge: 'En cours',
    tagline: 'Forge des légendes',
    description: 'Au cœur de la montagne, une caverne regorge d\'armes ancestrales enfouies par les guerriers du passé. Chaque épée raconte une histoire, chaque lame attend un nouveau maître.',
    features: [
      'Fabriquer une arme légendaire à partir des fragments découverts dans votre aventure',
      'Forgez votre propre lame auprès du maître des mille épées',
      'Chaque arme forgée porte une marque unique, gage de son pouvoir',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'Le Pacte du Cartographe',
    image: '/evenement/pacte-cartographe.webp',
    badge: 'Nouvel évènement',
    tagline: 'Conquête territoriale',
    description: 'Le monde est vaste, mais les territoires les plus riches n\'attendent que les plus audacieux. Les cartographes du royaume ont révélé l\'emplacement de terres vierges, prêtes à être revendiquées par les guildes les plus déterminées.',
    features: [
      'Achetez un territoire de guilde pour établir votre domination',
      'Affirmez la suprématie de votre clan en revendiquant les meilleures terres',
      'Défendez votre territoire contre les autres clans qui convoitent vos richesses',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'Le Comptoir d\'Odin',
    image: '/evenement/comptoir-odin.webp',
    badge: 'Nouvel évènement',
    tagline: 'Services V.I.P.',
    description: 'Le Père-de-Tout a ouvert son comptoir aux guerriers les plus méritants. Venez vendre ou acheter des services Vikings V.I.P. pour votre base. Le staff est à votre disposition pour réaliser vos souhaits de décoration les plus fous, ou pour acquérir un animal de compagnie qui veillera sur votre foyer.',
    features: [
      'Achetez des services V.I.P. pour personnaliser votre base selon vos envies',
      'Le staff réalise vos souhaits de décoration les plus fous',
      'Acquérez un animal de compagnie pour veiller sur votre foyer',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'La Chute des Braves',
    image: '/evenement/chute-braves.webp',
    badge: 'Nouvel évènement',
    tagline: 'Harpon mortel',
    description: 'À l\'aide de votre harpon, faites tomber les autres vikings d\'étage en étage. Tout en bas, les serpents attendent leur repas. Saurez-vous rester le dernier debout au sommet ?',
    features: [
      'Utilisez votre harpon pour précipiter vos adversaires d\'étage en étage',
      'Évitez de tomber vous-même — les serpents en contrebas ne font pas de distinction',
      'Seul le plus adroit et le plus stratégique atteindra le sommet',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
  {
    title: 'La Fureur des Cieux',
    image: '/evenement/fureur-cieux.webp',
    badge: 'Nouvel évènement',
    tagline: 'Bataille de catapultes',
    description: 'Une bataille de catapultes dans un lieu unique. Deux équipes s\'affrontent pour détruire les engins de siège adverses. La victoire revient à la première équipe qui a détruit toutes les catapultes ennemies.',
    features: [
      'Prenez le contrôle d\'une catapulte et bombardez les positions adverses',
      'Coordonnez-vous avec votre équipe pour détruire tous les engins de siège ennemis',
      'La première équipe à éliminer toutes les catapultes adverses remporte la victoire',
    ],
    ctaText: 'Rejoindre l\'évènement',
    ctaLink: '/nous-rejoindre',
  },
]

export default function Events() {
  return (
    <div className="page-shell events-page">
      <section className="section events-intro">
        <div className="container">
          <span className="eyebrow eyebrow-center">Les chroniques du royaume</span>
          <h1 className="section-title center">Évènements</h1>
          <p className="section-subtitle center">Des évènements réguliers pour rythmer la vie du serveur et récompenser les aventuriers.</p>
        </div>
      </section>

      <section className="events-showcase">
        <div className="container events-grid">
          {events.map((event) => (
            <article className="event-card" key={event.title}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <span className="event-shade" />
              </div>
              <div className="event-info">
                <span className="event-badge"><i />{event.badge}</span>
                <span className="eyebrow">{event.tagline}</span>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <ul className="event-features">
                  {event.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <a className="event-cta" href={event.ctaLink}>{event.ctaText} <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
