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
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    picture: {
        type: String,
        default: "https://res.cloudinary.com/dqtle5upc/image/upload/v1665972462/default_project_picture_jjvo89.jpg"
    },
    cloudinary_id: {
        type: String,
    }
},
{ collection: "projects" },
)

const projectModel = mongoose.model("ProjectrSchema", ProjectSchema)

module.exports = projectModel