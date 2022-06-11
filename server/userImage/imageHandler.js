const cloudinary = require("./cloudinary")
const user = require("../../model/user")

async function uploadImage(req, res) {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        return res.status(200).send("Profile image was uploaded successfully")
    } catch(error) {
        console.log("error", error)
    }
}

module.exports = uploadImage