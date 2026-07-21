import { useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import WorldSlider from '../components/WorldSlider'
import Lightbox from '../components/Lightbox'
import './Home.css'

const features = [
  { rune: 'ᛗ', number: '01', title: 'Un monde étendu', desc: 'Une carte plus vaste, ponctuée de régions secrètes et de terres encore vierges.' },
  { rune: 'ᛏ', number: '02', title: 'Quêtes inédites', desc: 'Des récits scénarisés, des PNJ vivants et des choix qui façonnent votre aventure.' },
  { rune: 'ᛉ', number: '03', title: 'Combats renouvelés', desc: 'Boss, créatures, armes et armures exclusifs pour repousser vos limites.' },
  { rune: 'ᛟ', number: '04', title: 'Une vraie communauté', desc: 'Guildes, entraide et évènements réguliers au cœur d’un monde persistant.' },
]

const gallery = [
  { src: '/screenshots/pic-du-loup.webp', title: 'Le Pic du Loup', tag: 'Montagnes' },
  { src: '/screenshots/village.webp', title: 'Fjornheim', tag: 'Terres centrales' },
  { src: '/screenshots/baie-corbeau.webp', title: 'La Baie du Corbeau', tag: 'Côtes oubliées' },
]

const reviews = [
  {
    author: 'Ydlen',
    role: 'Joueur des Terres de Viking',
    rune: 'ᛟ',
    text: 'Une vision nouvelle du jeu, surtout avec le HD en bonus. Beaucoup de choses à explorer et un début agréable avec l’accès aux villages et aux maisons. Une vraie claque.',
  },
  {
    author: 'HicSId',
    role: 'Joueur des Terres de Viking',
    rune: 'ᛉ',
    text: 'Super serveur Valheim ! L’ambiance est vraiment conviviale et les joueurs sont très sympathiques. Le staff est toujours disponible et réactif. Je recommande !',
  },
  {
    author: 'Poulpy',
    role: 'Aventurière des Terres de Viking',
    rune: 'ᚠ',
    text: 'Terres de Viking amène la quête de héros à un niveau supérieur. Une suite de quêtes exclusive, des surprises et une autre vision du jeu. La communauté vous attend !',
  },
]

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  return (
    <>
      <Hero />

      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-heading">
            <span className="eyebrow">Bienvenue dans le Nord</span>
            <h2 className="section-title">Bien plus qu'un serveur.<br />Un monde à habiter.</h2>
          </div>
          <div className="intro-copy">
            <p>Terres de Viking transforme Valheim en une aventure communautaire profonde. Bâtisseur, guerrier ou explorateur : trouve ta place, forge des alliances et laisse une trace dans un univers qui évolue avec ses habitants.</p>
            <Link to="/notre-communaute-viking-valheim" className="text-link">Découvrir notre communauté <span>→</span></Link>
          </div>
        </div>
        <div className="container"><WorldSlider /></div>
      </section>

      <section className="section feature-section section-dark">
        <div className="container">
          <span className="eyebrow eyebrow-center">Une expérience sur mesure</span>
          <h2 className="section-title center">Votre saga commence ici</h2>
          <p className="section-subtitle center">Chaque système a été pensé pour enrichir l'aventure sans trahir l'âme de Valheim.</p>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <span className="feature-rune" aria-hidden="true">{feature.rune}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
          <div className="section-action"><Link to="/fonctionnalites-valheim-viking" className="btn btn-outline">Explorer toutes les fonctionnalités <span className="btn-arrow">→</span></Link></div>
        </div>
      </section>

      <section className="section places-section">
        <div className="container places-head">
          <div><span className="eyebrow">Carnet d'exploration</span><h2 className="section-title">Des lieux qui racontent<br />leur propre histoire.</h2></div>
          <Link to="/captures-decran" className="text-link">Voir toute la galerie <span>→</span></Link>
        </div>
        <div className="container place-grid">
          {gallery.map((place, index) => (
            <button type="button" className={`place-card place-${index + 1}`} onClick={() => setLightboxIndex(index)} key={place.title} aria-label={`Agrandir ${place.title}`}>
              <img src={place.src} alt={place.title} />
              <span className="place-shade" />
              <div><small>{place.tag}</small><h3>{place.title}</h3></div>
              <span className="place-expand" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section testimonial-section section-dark">
        <div className="container">
          <div className="reviews-heading">
            <div><span className="eyebrow">Paroles de Vikings</span><h2 className="section-title">Ils vivent déjà<br />l'aventure.</h2></div>
            <p>Des récits authentiques, écrits par celles et ceux qui font vivre les Terres de Viking chaque jour.</p>
          </div>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <article className="review-card" key={review.author}>
                <div className="review-card-top"><span>{String(index + 1).padStart(2, '0')}</span><i>{review.rune}</i></div>
                <blockquote>“{review.text}”</blockquote>
                <footer>
                  <span className="review-avatar">{review.author[0]}</span>
                  <div><strong>{review.author}</strong><small>{review.role}</small></div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section join-section">
        <div className="join-bg" />
        <div className="container join-content">
          <span className="eyebrow eyebrow-center">Le Valhalla vous attend</span>
          <h2>Prêt à écrire<br />votre légende ?</h2>
          <p>Rejoignez les terres du Nord et rencontrez celles et ceux qui deviendront vos compagnons de saga.</p>
          <div className="join-actions">
            <a href="https://discord.com/invite/3K4vbNCZ3Q" target="_blank" rel="noreferrer" className="btn">Rejoindre le Discord <span className="btn-arrow">↗</span></a>
            <Link to="/nous-rejoindre" className="btn btn-outline">Comment nous rejoindre</Link>
          </div>
        </div>
      </section>
      <Lightbox images={gallery} current={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
    </>
  )
}
