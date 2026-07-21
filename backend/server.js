const express = require('express')
const cors = require('cors')
const path = require('path')
const apiRoutes = require('./routes/api')

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', apiRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Backend Terres de Viking running on port ${PORT}`)
})
