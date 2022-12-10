const mongoose = require('mongoose')

if (process.argv.length < 3) {
return  console.log('Please provide the password as an argument: node mongo.js <password>')
  
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.s7rer.mongodb.net/DB-Contact?retryWrites=true&w=majority`

  mongoose.set('strictQuery', true);

  mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: {type:String , require: true},
  number: {type: Number , require:true}
})

const Persons = mongoose.model('Person', personsSchema)

const Person = new Persons({
    name,
    number
})
if (process.argv.length === 3) {
   Persons.find({}).then(result => {
    console.log('phonebook:');
    result.map(p => {
        return console.log(`${p.name} , ${p.number}`);  
    })
    mongoose.connection.close()
   })
}else{
    Person.save().then(result => {
      console.log('note saved!')
      mongoose.connection.close()
    })
    .catch(err => console.log(err))
}