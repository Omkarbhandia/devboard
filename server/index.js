const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 5001

app.use(cors({ origin: 'http://localhost:3002', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'DevBoard API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})