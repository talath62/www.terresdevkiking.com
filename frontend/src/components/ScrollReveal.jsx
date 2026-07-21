import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const selectors = [
  '.section-title',
  '.section-subtitle',
  '.intro-copy',
  '.world-slider',
  '.feature-card',
  '.place-card',
  '.review-card',
  '.join-content',
  '.page-shell .grid-2 > *',
  '.gallery-page .screenshot-button',
  '.events-page .grid-2 > *',
  '.video-card',
].join(',')

export default function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const elements = [...document.querySelectorAll(selectors)]
    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-delay', `${(index % 5) * 65}ms`)
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
