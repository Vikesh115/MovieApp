const mongoose  = require('mongoose')

const castSchema = mongoose.Schema({
    cast: [
        {
            name: {type: String},
        }
    ],
    id: 
})

module.exports = mongoose.model('cast', castSchema)