const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express()

const persons =  [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    }
  ]

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
    return next( "no hay cuerpo en la request")
  }  
  const {name ,number} = req.body
  if (!name) {
    next({error:'no hay nombre en cuerpo', status: 204})
  }else if (!number) {
    next({error:'no hay numero en cuerpo', status: 204})
  }
  const filter = persons.filter((p) => {
    return  p.name.toLocaleLowerCase() === name.toLocaleLowerCase() 
    ?p
    :null
  })
  console.log(filter.length);
  if (filter.length > 0) {
    next({error:'ya existe este contacto', status: 203})
  }

  const randomID = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  }
  const id = randomID(persons[persons.length -1].id, 9999999)
 res.json(  {name , number , id })
 
})
app.get('/api/persons', (req ,res ) => {
    res.json(persons)
})
app.get('/api/persons/:id', (req ,res ,next) => {
  console.log(parseInt(req.params.id));
  const filter = persons.filter((p) => {
    return p.id === parseInt(req.params.id)
    ? p
    :null
  })
  if (filter.length > 0) {
      res.json(filter)
  }
  next({error:'no hay contactos que concidan', status: 204})
})
app.delete('/api/persons/:id', (req ,res ) => {
  console.log(parseInt(req.params.id));
    res.json(persons.filter((p) => {
      return p.id === parseInt(req.params.id)
      ? null
      :p
    }))
})
app.get('/api/info', (req ,res ) => {
    res.send(`
    <h2>La agenda cuenta con la informacion de:  ${persons.length}</h2>
    <br/>
    <h3>${Date()}</h3>
    `)
})
app.use((err, req, res, next) => {
  console.log('el error:',err.error, ' status:' , err.status);
  res.send(err.error).status(err.status)
  
})
const port = 3001
app.listen(port , () => {
    console.log(`Server corriendo en el puerto ${port}`);
})


