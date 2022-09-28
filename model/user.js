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
    phone: {
        type: String,
    },
    password: {
        type: String, 
        required: true 
    },
    gender: {
        String
    },
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/dqtle5upc/image/upload/v1655088388/default_user_icon_vr0gng.jpg"
    },
    cloudinary_id: {
        type: String,
    }
},
{ collection: "users" }
)

const userModel = mongoose.model("UserSchema", UserSchema)

module.exports = userModel