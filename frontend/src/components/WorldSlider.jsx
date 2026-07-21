import { useEffect, useRef, useState } from 'react'
import './WorldSlider.css'

const slides = [
  { image: '/sliders/royaume-des-prairies.webp', title: 'Le Royaume des Prairies', region: 'Terres centrales', text: 'Les premières terres d’une aventure qui ne ressemble à aucune autre.' },
  { image: '/sliders/sanctuaire-ancien.webp', title: 'Le Sanctuaire Ancien', region: 'Rivages mystiques', text: 'Des vestiges animés par une magie que même les anciens redoutaient.' },
  { image: '/sliders/forteresse-du-nord.webp', title: 'La Forteresse du Nord', region: 'Montagnes gelées', text: 'Une citadelle dressée contre la nuit et les tempêtes éternelles.' },
  { image: '/sliders/autel-des-anciens.webp', title: 'L’Autel des Anciens', region: 'Bois interdits', text: 'Chaque pierre porte la mémoire des héros venus avant vous.' },
  { image: '/sliders/port-viking.webp', title: 'Le Port de Fjornheim', region: 'Côtes de l’Ouest', text: 'Point de départ des grandes expéditions au-delà des mers connues.' },
  { image: '/sliders/ruines-sous-la-lune.webp', title: 'Les Ruines sous la Lune', region: 'Forêt noire', text: 'La nuit révèle parfois ce que le jour préfère garder secret.' },
]

export default function WorldSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const pointerStart = useRef(null)

  useEffect(() => {
    if (paused) return undefined
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused])

  const change = (step) => setCurrent((index) => (index + step + slides.length) % slides.length)

  const endSwipe = (event) => {
    if (pointerStart.current === null) return
    const distance = event.clientX - pointerStart.current
    if (Math.abs(distance) > 45) change(distance > 0 ? -1 : 1)
    pointerStart.current = null
  }

  return (
    <div className="world-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onPointerDown={(event) => { pointerStart.current = event.clientX }} onPointerUp={endSwipe}>
      <div className="slider-stage">
        {slides.map((slide, index) => (
          <figure className={`slider-slide ${index === current ? 'active' : ''}`} key={slide.image} aria-hidden={index !== current}>
            <img src={slide.image} alt={slide.title} loading={index === 0 ? 'eager' : 'lazy'} />
          </figure>
        ))}
        <div className="slider-overlay" />
        <div className="slider-caption" key={current}>
          <span>{slides[current].region}</span>
          <h3>{slides[current].title}</h3>
          <p>{slides[current].text}</p>
        </div>
        <div className="slider-index"><strong>{String(current + 1).padStart(2, '0')}</strong><i />{String(slides.length).padStart(2, '0')}</div>
        <div className="slider-arrows">
          <button type="button" onClick={() => change(-1)} aria-label="Image précédente">←</button>
          <button type="button" onClick={() => change(1)} aria-label="Image suivante">→</button>
        </div>
      </div>
      <div className="slider-nav" aria-label="Choisir une image">
        {slides.map((slide, index) => (
          <button type="button" className={index === current ? 'active' : ''} onClick={() => setCurrent(index)} key={slide.image} aria-label={`Afficher ${slide.title}`}>
            <span>{String(index + 1).padStart(2, '0')}</span><i />
          </button>
        ))}
      </div>
    </div>
  )
}
