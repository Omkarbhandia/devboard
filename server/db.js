const mongoose = require('mongoose')

const connectDB = async (retries = 5, delay = 5000) => {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not set!')
    process.exit(1)
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: false,
        serverSelectionTimeoutMS: 10000,
      })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      return
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`)
      if (attempt === retries) {
        console.error('All MongoDB connection attempts exhausted. Exiting.')
        process.exit(1)
      }
      console.log(`Retrying in ${delay / 1000}s...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

module.exports = connectDB