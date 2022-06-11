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
    gender: {
        String
    },
    profilePicture: {
        type: String
    },
    cloudinary_id: {
        type: String
    }
},
{ collection: "users" }
)

const userModel = mongoose.model("UserSchema", UserSchema)

module.exports = userModel