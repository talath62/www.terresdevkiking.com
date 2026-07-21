import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import './Lightbox.css'

export default function Lightbox({ images, current, onChange, onClose }) {
  const pointerStart = useRef(null)
  const image = current === null ? null : images[current]

  useEffect(() => {
    if (!image) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((current - 1 + images.length) % images.length)
      if (event.key === 'ArrowRight') onChange((current + 1) % images.length)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [current, image, images.length, onChange, onClose])

  if (!image) return null

  const change = (step) => onChange((current + step + images.length) % images.length)
  const endSwipe = (event) => {
    if (pointerStart.current === null) return
    const distance = event.clientX - pointerStart.current
    if (Math.abs(distance) > 55) change(distance > 0 ? -1 : 1)
    pointerStart.current = null
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Agrandissement : ${image.title || image.alt}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="lightbox-runes" aria-hidden="true">ᚠ ᛟ ᚱ ᚷ ᛖ</div>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Fermer la galerie" autoFocus><span>Fermer</span> ×</button>

      <button type="button" className="lightbox-arrow lightbox-prev" onClick={() => change(-1)} aria-label="Image précédente">←</button>
      <figure className="lightbox-figure" onPointerDown={(event) => { pointerStart.current = event.clientX }} onPointerUp={endSwipe}>
        <div className="lightbox-image-wrap" key={image.src}>
          <img src={image.src} alt={image.title || image.alt} />
        </div>
        <figcaption>
          <div><span>{image.tag || 'Terres de Viking'}</span><h3>{image.title || image.alt}</h3></div>
          <div className="lightbox-count"><strong>{String(current + 1).padStart(2, '0')}</strong><i />{String(images.length).padStart(2, '0')}</div>
        </figcaption>
      </figure>
      <button type="button" className="lightbox-arrow lightbox-next" onClick={() => change(1)} aria-label="Image suivante">→</button>

      <div className="lightbox-dots" aria-hidden="true">
        {images.map((item, index) => <i className={index === current ? 'active' : ''} key={item.src} />)}
      </div>
    </div>,
    document.body,
  )
}

Lightbox.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    alt: PropTypes.string,
    tag: PropTypes.string,
  })).isRequired,
  current: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
