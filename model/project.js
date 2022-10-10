const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema',
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    date: {
        type: String, 
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now
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
)

const projectModel = mongoose.model("ProjectrSchema", ProjectSchema)

module.exports = projectModel