const express = require('express')
const path = require('path')
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')
const valhallaRoutes = require('./routes/valhalla')

const app = express()
const PORT = process.env.PORT || 3002

app.set('trust proxy', 1)
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', apiRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/valhalla', valhallaRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Backend Terres de Viking running on port ${PORT}`)
})
