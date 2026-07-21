import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://www.terresdeviking.com'

const pages = {
  '/': {
    title: 'Terres de Viking | Serveur Valheim francophone',
    description: 'Rejoignez Terres de Viking, un serveur Valheim francophone enrichi de quêtes, lieux exclusifs, évènements et d’une communauté active.',
    label: 'Accueil',
    image: '/og-image.jpg',
  },
  '/notre-communaute-viking-valheim': {
    title: 'Communauté Valheim francophone | Terres de Viking',
    description: 'Découvrez une communauté Valheim francophone active et bienveillante, ses guildes, ses évènements réguliers et son équipe disponible.',
    label: 'Notre communauté',
    image: '/screenshots/village.webp',
  },
  '/nous-rejoindre': {
    title: 'Rejoindre notre serveur Valheim | Terres de Viking',
    description: 'Toutes les étapes pour rejoindre le serveur Valheim Terres de Viking : Discord, candidature, installation et connexion au royaume.',
    label: 'Nous rejoindre',
    image: '/screenshots/fjornheim.webp',
  },
  '/regles-du-serveur-valheim': {
    title: 'Règles du serveur Valheim | Terres de Viking',
    description: 'Consultez les règles de Terres de Viking pour profiter d’une aventure Valheim conviviale, équilibrée et respectueuse de chaque joueur.',
    label: 'Règles du serveur',
    image: '/screenshots/lyanore.webp',
  },
  '/captures-decran': {
    title: 'Captures d’écran Valheim | Terres de Viking',
    description: 'Explorez en images les villages, forteresses, sanctuaires et paysages exclusifs du serveur Valheim francophone Terres de Viking.',
    label: 'Captures d’écran',
    image: '/screenshots/brumecoeur.webp',
  },
  '/fonctionnalites-valheim-viking': {
    title: 'Fonctionnalités du serveur Valheim | Terres de Viking',
    description: 'Carte étendue, quêtes scénarisées, PNJ, équipements, créatures, boss et lieux exclusifs : découvrez notre expérience Valheim enrichie.',
    label: 'Fonctionnalités',
    image: '/screenshots/citadelle.webp',
  },
  '/evenements-valheim-viking': {
    title: 'Évènements Valheim | Terres de Viking',
    description: 'Découvrez les évènements communautaires et aventures scénarisées organisés régulièrement sur le serveur Valheim Terres de Viking.',
    label: 'Évènements',
    image: '/screenshots/autels-mystiques.webp',
  },
  '/videos': {
    title: 'Vidéos Valheim | Terres de Viking',
    description: 'Découvrez les vidéos officielles de Terres de Viking : communauté, aventures et Saison 4 du serveur Valheim francophone.',
    label: 'Vidéos',
    image: '/video-thumbnails/serment-de-fer.webp',
    videos: [
      { name: 'Merci à la communauté Valheim - Terres de Viking !', description: 'Un hommage à la communauté du serveur Valheim Terres de Viking.', id: 'WEn2ylwEy38', thumbnail: '/video-thumbnails/merci-communaute.webp' },
      { name: 'Valheim 2026 - Saison 4 - Le Serment de Fer', description: 'Découvrez la Saison 4 du serveur Valheim Terres de Viking.', id: '5OHkG3KY_vM', thumbnail: '/video-thumbnails/serment-de-fer.webp' },
    ],
  },
}

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pages[pathname] || pages['/']
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    const image = page.image.startsWith('http') ? page.image : `${SITE_URL}${page.image}`

    document.title = page.title
    setMeta('name', 'description', page.description)
    setMeta('name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('property', 'og:title', page.title)
    setMeta('property', 'og:description', page.description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:image:alt', page.label)
    setMeta('property', 'og:locale', 'fr_FR')
    setMeta('property', 'og:site_name', 'Terres de Viking')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', page.title)
    setMeta('name', 'twitter:description', page.description)
    setMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    let schema = document.getElementById('page-schema')
    if (!schema) {
      schema = document.createElement('script')
      schema.id = 'page-schema'
      schema.type = 'application/ld+json'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: page.title,
          description: page.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          primaryImageOfPage: { '@type': 'ImageObject', url: image },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: pathname === '/' ? [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          ] : [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: page.label, item: url },
          ],
        },
        ...(page.videos || []).map((video) => ({
          '@type': 'VideoObject',
          name: video.name,
          description: video.description,
          thumbnailUrl: `${SITE_URL}${video.thumbnail}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
          contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
        })),
      ],
    })
  }, [pathname])

  return null
}
