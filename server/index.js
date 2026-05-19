require('dotenv').config({ path: '.env.local' })
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./db');
const authRoutes = require('./routes/auth')
const protect = require('./middleware/auth')


const app = express()
const PORT = 5001

//Connect MongoDb
connectDB()

app.use(cors({ origin: 'http://localhost:3002', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'DevBoard API is running' })
})

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you are authorized!` })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})