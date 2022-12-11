const mongoose = require('mongoose')

const url = process.env.DB_URI
mongoose.set('strictQuery', true)


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

