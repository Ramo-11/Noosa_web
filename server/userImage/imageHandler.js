const cloudinary = require("./cloudinary")
const user = require("../../model/user")
const { getLoggerType } = require("../../utils/loggers/loggerType")
generalLogger = getLoggerType("general")

async function uploadImage(req, res) {
    try {
        // Get user's name to specify folder to upload image to
        const userID = req.user._id
        const user_ = await user.findById(userID)

        // Upload the image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { folder: user_.name })
        const newDetails = {
            profilePicture: result.secure_url,
            cloudinary_id: result.public_id
        }

        // Update user's profile image
        await user.findByIdAndUpdate(userID, newDetails)
        
        const customMessage = "User: " + user_.name + "'s profile picture has been uploaded"
        generalLogger.info(customMessage)
        return res.status(200).send("Profile picture was uploaded successfully")
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = {
    uploadImage
}