const express = require('express')
const { getServerStats } = require('../services/steamQuery')
const router = express.Router()

router.get('/stats', async (req, res) => {
  const stats = await getServerStats()
  res.json(stats)
})

router.get('/events', (req, res) => {
  res.json([
    { id: 1, title: 'Autels Mystiques', status: 'En cours', desc: 'Un évènement mystique où des autels anciens apparaissent à travers le monde.' },
    { id: 2, title: 'SkollHell – La porte des enfers', status: 'En cours', desc: 'Les portes des enfers se sont ouvertes !' },
    { id: 3, title: 'Le Mausolée de Níðhöggr', status: 'En cours', desc: 'Explorez le mausolée du dragon Níðhöggr.' },
    { id: 4, title: 'Le Fléau des Trois Lunes', status: 'En cours', desc: 'Sous la lueur des trois lunes, des créatures ancestrales se réveillent.' },
  ])
})

router.get('/posts', (req, res) => {
  res.json([
    { id: 1, title: 'Le Pêcheur des Océans Oubliés', date: '2025-07-15', excerpt: 'Une légende raconte qu\'un pêcheur solitaire parcourt les océans...' },
    { id: 2, title: 'Le siège de la tour des brumes', date: '2025-07-10', excerpt: 'Les armées du Nord se rassemblent pour le siège de la tour des brumes...' },
    { id: 3, title: 'La légende de Moder', date: '2025-07-05', excerpt: 'Moder, la reine des glaces, veille sur son domaine depuis des siècles...' },
  ])
})

module.exports = router
