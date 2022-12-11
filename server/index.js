require('dotenv').config()
require('../Databases/mongo')
const cors = require('cors')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const { Persons } = require('../Databases/models/Persons.models')
const app = express()

// morgan Middelware Token Config
morgan.token('body',(req) => JSON.stringify(req.body))

//statics files 
app.use(express.static(path.join(__dirname, '../build'))) 
// Middelware 
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :body'))
app.use(cors())


// Routes
app.post('/api/persons' ,(req, res, next) => {
  if (!req.body) {
    return next( 'no hay cuerpo en la request')
  }  
  const {name ,number} = req.body
  console.log(number ,name)
  if (!name) {
    next({error:'no hay nombre en cuerpo', status: 204})
  }else if (!number) {
    next({error:'no hay numero en cuerpo', status: 204})
  }else if (number.length < 8) {
    next({error:'El numero debe tener mas de 8 digitos' , status: 412})
  }else if (name.length < 3) {
    next({error:'El numero debe tener mas de 8 digitos' , status: 412})
  }else{

    const savePerson = new Persons({
      name,
      number
    })
    savePerson.save()
      .then(result => res.json(result))
      .catch(err => next({error: err.message , status: 409}))
  }
  
})
app.get('/api/persons', (req ,res ,next) => {
  Persons.find({})
    .then(result => res.json(result))
    .catch(err => next({error: err.message , status: 400}))
})
app.get('/api/persons/:name', (req ,res ,next) => {
  const {name} = req.params
  console.log(name)
  Persons.find({name})
    .then(result => res.json(result))
    .catch(err => next({error: err.message , status: 400}))
})
app.delete('/api/persons/:id', (req ,res , next) => {
  const {id} = req.params
  Persons.findByIdAndDelete({_id: id})
    .then(result => res.json(result))
    .catch(err => next({error: err.message , status: 400}))
})
app.put('/api/persons/:id', (req ,res , next) => {
  const {id} = req.params
  const {name , number} = req.body
  Persons.findByIdAndUpdate({_id: id},{ name, number} )
    .then(result => res.json(result))
    .catch(err => next({error: err.message , status: 400}))
})
app.get('/api/info', (req ,res ) => {
  Persons.find({})
    .then(result => res.json({data: result.length , fecha: Date()}))
    .catch(err => next({error: err.message , status: 400}))
})
app.use((err, req, res, next) => {
  console.log('el error:',err.error, ' status:' , err.status)
  
  res.status(err.status).send(err.error)
})
const port = process.env.PORT
app.listen(port , () => {
  console.log(`Server corriendo en el puerto ${port}`)
})


