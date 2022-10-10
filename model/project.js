const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema'
    },
    title: {
        type: String, 
        required: true
    },
    date: {
        type: String, 
        required: true, 
    },
    picture: {
        type: String,
        default: ""
    },
    cloudinary_id: {
        type: String,
    }
},
{ collection: "projects" },
{ timestamps: true}
)

const projectModel = mongoose.model("ProjectrSchema", ProjectSchema)

module.exports = projectModel