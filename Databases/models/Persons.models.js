const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const personsSchema = new Schema({
  name: {type:String , required: true , unique:true ,uniqueCaseInsensitive: true},
  number: {type: Number , required:true}
})
uniqueValidator.defaults.message = 'Error, expected {PATH} to be unique.'
personsSchema.plugin(uniqueValidator)
personsSchema.set('toJSON' , {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id
    delete returnObj._id
    delete returnObj.__v
  }
})
const Persons = model('Person', personsSchema)
  
module.exports = {Persons}
  