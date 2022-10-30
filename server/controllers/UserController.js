const user = require("../../model/user")
const cloudinary = require("../pictureHandlers/cloudinary")
const bcrypt = require("bcryptjs");
const { validateEmail, verifyPassword } = require("../../utils/authentication")

const { getLoggerType } = require("../../utils/loggers/loggerType");
userLogger = getLoggerType("user")

// create new user
async function createUser (req, res) {
    const { name, email, password: plainTextPassword } = req.body

    // verify that all fields entered by user are valid
    if (!name) {
        userLogger.error("Unable to create user")
        userLogger.debug("name [" + name + "] is not valid")
        return res.status(400).send({ message: "Name cannot be empty" })
    }
    if (!email || typeof email !== "string" || !validateEmail(email)) {
        userLogger.error("Unable to create user")
        userLogger.debug("email [" + email + "] is not valid")
        return res.status(400).send({ message: "Invalid email" })
    }
    passwordCheck = verifyPassword(plainTextPassword)
    if (passwordCheck !== "password is good") {
        userLogger.error("Unable to create user")
        userLogger.debug("password [" + plainTextPassword + "] is not valid")
        return res.status(400).send({ message: passwordCheck })
    }
    
    // encrypt the password
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await user.create({
            name,
            email,
            password
        }) 
        userLogger.info("user with name [" + name + "] was created successfully")
        return res.status(200).send({ message: "User was created successfully" })
    } catch (error) {
        if (error.code === 11000) {
            userLogger.error("unable to register user: email already exists")
            userLogger.debug(error)
            return res.status(400).send({ message: "Unable to create user: email already exists" })
        }
        else {
            userLogger.error("unable to register user")
            userLogger.debug(error)
            return res.status(400).send({ message: "Unable to create user" })
        }
    }
}

 async function getUsers(req, res) {
    try {
        const userID = req.user._id
        const currentUser = await user.findById(userID)

        let users = await user.find({}, { name: 1, email: 1, profilePicture: 1, _id: 1 })

        // Do not return the current logged in user in the list of users for the search field
        users = users.filter(obj => JSON.stringify(obj._id) !== JSON.stringify(currentUser._id))

        userLogger.info("List of users was retrieved successfully from the database")
        res.status(200)
        return res.json(users)
    } catch (error) {
        userLogger.error("Unable to get list of users from database")
        userLogger.debug(error)
        return res.status(400).send({ message: "Unable to get list of users from database" })
    }
}

async function updateUser(req, res) {
    const userID = req.user._id
    const { name, email } = req.body

    if (!name) {
        userLogger.error("Unable to update user")
        userLogger.debug("name [" + name + "] is not valid")
        return res.status(400).send({ message: "Unable to update user: name cannot be empty" })
    }

    if (!email || typeof email !== "string" || !validateEmail(email)) {
        userLogger.error("Unable to update user")
        userLogger.debug("email [" + email + "] is not valid")
        return res.status(400).send({ message: "Unable to update user: email is invalid" })
    }

    try {
        if (req.file != undefined) {
            const picture = req.file.path
            const user_ = await user.findById(userID)
            const result = await cloudinary.uploader.upload(picture, { folder: user_.name })

            await user.findByIdAndUpdate(userID, {
                name,
                email,
                profilePicture: result.secure_url,
                cloudinary_id: result.public_id
            })
        }
        else {
            await user.findByIdAndUpdate(userID, {
                name,
                email
            })
        }

        userLogger.info("user was updated successfully")
        return res.status(200).send( {message: "Success: user was updated successfully" })
    } catch (error) {
        if (error.codeName == "DuplicateKey") {
            userLogger.error("Unable to update user")
            userLogger.debug("email [" + email + "] is already being used")
            return res.status(400).send({ message: "Unable to update user: email is already being used" })
        } else {
            userLogger.error("Error in updating user")
            userLogger.debug(error)
            return res.status(400).send({ message: "Unable to update user" })
        }        
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser
}