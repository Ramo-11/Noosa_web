const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String, 
        required: true 
    },
    gender: String,
    profilePictureURL: String
},
{ collection: "users" }
)

const userModel = mongoose.model("UserSchema", UserSchema)

module.exports = userModel