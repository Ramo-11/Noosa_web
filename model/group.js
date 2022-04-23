const mongoose = require('mongoose')
const User = require('userModel')

const GroupSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    total_duration: {
        type: String, 
        required: true, 
    },
    start_date: {
        type: String,
        required: true
    },
    individual_payment: {
        type: String, 
        required: true 
    },
    users: [User]
},
{ collection: 'groups' }
)

const groupModel = mongoose.model('GroupSchema', GroupSchema)

module.exports = groupModel