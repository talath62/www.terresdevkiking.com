import { useState } from 'react'
import './Videos.css'

const videos = [
  {
    id: 'WEn2ylwEy38',
    image: '/video-thumbnails/merci-communaute.webp',
    title: 'Merci à la communauté Valheim',
    label: 'La communauté',
    description: 'Un hommage à celles et ceux qui construisent, explorent et font vivre chaque jour les Terres de Viking.',
  },
  {
    id: '5OHkG3KY_vM',
    image: '/video-thumbnails/serment-de-fer.webp',
    title: 'Saison 4 — Le Serment de Fer',
    label: 'La saga continue',
    description: 'Découvrez les terres, les défis et les mystères qui vous attendent dans la quatrième saison de notre aventure.',
  },
  {
    id: '46NsdQyNWdY',
    image: '/video-thumbnails/valhalla-waiting.webp',
    title: 'L\'Attente du Valhalla',
    label: 'L\'esprit viking',
    description: 'Une immersion dans l\'attente du Valhalla, entre mythes nordiques et ambiance épique propre à Terres de Viking.',
  },
  {
    id: '3TrSmm8e174',
    image: '/video-thumbnails/aurore-boreale.webp',
    title: 'Odin veille sur les Terres',
    label: 'L\' Odin veille',
    description: 'Laissez-vous porter par la beauté des aurores boréales qui illuminent le ciel des Terres de Viking.',
  },
]

export default function Videos() {
  const [playing, setPlaying] = useState(null)

  return (
    <div className="page-shell videos-page">
      <section className="section videos-intro">
        <div className="container">
          <span className="eyebrow eyebrow-center">Chroniques du royaume</span>
          <h1 className="section-title center">Nos vidéos</h1>
          <p className="section-subtitle center">Plongez dans l’univers de Terres de Viking, découvrez notre communauté et revivez les grands chapitres de la saga.</p>
        </div>
      </section>

      <section className="videos-showcase">
        <div className="container videos-list">
          {videos.map((video, index) => (
            <article className="video-card" key={video.id}>
              <div className="video-frame">
                {playing === video.id ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button type="button" className="video-poster" onClick={() => setPlaying(video.id)} aria-label={`Lire la vidéo : ${video.title}`}>
                    <img src={video.image} alt="" />
                    <span className="video-shade" />
                    <span className="video-play"><i>▶</i><small>Lire la vidéo</small></span>
                  </button>
                )}
                <span className="video-corner corner-top" />
                <span className="video-corner corner-bottom" />
              </div>
              <div className="video-copy">
                <div className="video-number"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
                <span className="eyebrow">{video.label}</span>
                <h2>{video.title}</h2>
                <p>{video.description}</p>
                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">Voir sur YouTube <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section video-channel">
        <div className="container video-channel-inner">
          <div><span className="eyebrow">Suivre la saga</span><h2>Ne manquez aucun<br />nouveau chapitre.</h2></div>
          <a className="btn" href="https://www.youtube.com/@TerresDeViking-Valheim" target="_blank" rel="noreferrer">Découvrir la chaîne YouTube <span className="btn-arrow">↗</span></a>
        </div>
      </section>
    </div>
  )
}
