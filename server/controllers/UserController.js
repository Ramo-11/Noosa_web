const user = require("../../model/user")
const cloudinary = require("../pictureHandlers/cloudinary")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateEmail, verifyPassword } = require("../../utils/authentication")

const { getLoggerType } = require("../../utils/loggers/loggerType");
authLogger = getLoggerType("authentication")

const JWT_SECRET = "kasdkfjioe.,mncv xkio@#@#%#$#nbsw#$knlk23@@3kln3%#4323nk"

// create new user
async function createUser(req, res) {
    const { name, email, password: plainTextPassword } = req.body

    // verify that all fields entered by user are valid
    if(!name) {
        authLogger.error("user name is empty")
        return res.status(400).send({message: "Name cannot be empty"})
    }
    if(!email || typeof email !== "string" || !validateEmail(email)) {
        authLogger.error("email is not valid")
        return res.status(400).send({message: "Invalid email"})
    }
    passwordCheck = verifyPassword(plainTextPassword)
    if(passwordCheck !== "password is good") {
        authLogger.error("password is not valid")
        return res.status(400).send({message: passwordCheck})
    }
    
    // encrypt the password
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await user.create({
            name,
            email,
            password
        }) 
        authLogger.info('user with name [' + name + '] was created successfully')
        return res.status(200).send({message: "User was created successfully"})
    } catch (error) {
        if(error.code === 11000) {
            authLogger.error("unable to register user: email already exists")
            return res.status(400).send({message: "Email already exists"})
        }
        else {
            authLogger.error("unable to register user: error occurd" + error)
            return res.status(400).send({message: "Unable to create user"})
        }
    }
}

 async function getUsers(req, res) {
    try {
        const user_ = await user.find({}, { name: 1, email: 1, profilePicture: 1, _id: 1 })
        authLogger.info("List of users was retrieved successfully from the database")
        res.status(200)
        return res.json(user_)
    } catch (error) {
        authLogger.error("Unable to get list of users from database")
        authLogger.debug(error)
        return res.status(400).send({message: "Unable to get list of users from database"})
    }
}

async function updateUser(req, res) {
    const userID = req.user._id
    const { name, email } = req.body

    if(!name) {
        let error_message = "name cannot be empty"
        authLogger.error("Error in updating user: " + error_message)
        return res.status(400).send({message: "Error: " + error_message})
    }

    if(!email || typeof email !== "string" || !validateEmail(email)) {
        let error_message = "email is invalid"
        authLogger.error("Error in updating user: " + error_message)
        return res.status(400).send({message: "Error: " + error_message})
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

        authLogger.info("user was updated successfully")
        return res.status(200).send({message: "Success: user was updated successfully"})
    } catch (error) {
        if (error.codeName == "DuplicateKey") {
            let error_message = "email is already in use"
            authLogger.error("Error in updating user: " + error_message)
            return res.status(400).send({message: "Error: " + error_message})
        } else {
            authLogger.error("Error in updating user")
            return res.status(400).send({message: "Unable to update user: " + error})
        }        
    }
}

async function deleteUser (req, res) {
    const userID = req.params.id
    try {
        await user.findByIdAndDelete(userID)
        return res.status(200).send({message: "Users were deleted successfully"})
    } catch (error) {
        return res.status(400).send({message: "Unable to delete user"})
    }
}

async function change_password (req, res) {
    const { token } = req.headers
    const { newPassword } = req.body
    
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(newPassword)

        passwordCheck = verifyPassword(newPassword)
        if(passwordCheck !== "password is good")
            return res.state(400).send({message: passwordCheck})

        await user.updateOne( 
            {_id }, 
            { 
                $set: { password }
            }
        )
        authLogger.info("password was changed successfully")
        return res.status(200).send({message: "Password was changed successfully"})
    } catch (error) {
        authLogger.error(error)
        return res.status(400).send({message: "Invalid request"})
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    change_password
}