const userModel = require('../../model/user')
const bcrypt = require('bcryptjs');
const { send } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
const { validateEmail, verifyPassword } = require('../../utils/authentication')

const JWT_SECRET = 'kasdkfjioe.,mncv xkio@#@#%#$#nbsw#$knlk23@@3kln3%#4323nk'

// create new userModel
async function createUser(req, res) {
    const { name, email, password: plainTextPassword } = req.body

    // verify that all fields entered by user are valid
    if(!name)
        return res.status(400).send({message: "name cannot be empty"})
    if(!email || typeof email !== 'string' || !validateEmail(email))
        return res.status(400).send({message: "invalid email"})
    passwordCheck = verifyPassword(plainTextPassword)
    if(passwordCheck !== "password is good")
        return res.state(400).send({message: passwordCheck})

    // encrypt the password
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await userModel.create({
            name,
            email,
            password
        }) 
        return res.status(200).send({message: "user was created successfully"})
    } catch (error) {
        if(error.code === 11000)
            return res.status(400).send({message: "email already exists"})
        else
            return res.status(400).send({message: "unable to create user"})
    }
}

 async function findUser(req, res) {
    try {
        const user = await userModel.find()
        return res.json(user)
    } catch (error) {
        return res.status(400).send({message: "unable to get data from database"})
    }
}

async function updateUser(req, res) {
    const userID = req.params.id
    try {
        await userModel.findByIdAndUpdate(userID, req.body)
        return res.status(200).send({message: "user was updated successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to update user"})
    }
}

async function deleteUser (req, res) {
    const userID = req.params.id
    try {
        await userModel.findByIdAndDelete(userID)
        return res.status(200).send({message: "U sers were deleted successfully"})
    } catch (error) {
        return res.status(400).send({message: "Unable to delete user"})
    }
}

async function loginUser (req, res) {
    const { email, password } = req.body
    try {
        if(email && password) {
            // User is already logged in
            if(req.session.user)
                return res.status(400).send({message: "User is already logged in"})
            else {
                const user = await userModel.findOne({ email }).lean()
                if(await bcrypt.compare(password, user.password)) {
                    req.session.user = {
                        email,
                    }
                    return res.status(200).send({message: "Log in was successful"})
                }
                else
                    return res.status(400).send({message: "Password is not correct"})
            }
        }
        else {
            return res.status(400).send({message: "Email and password must not be empty"})
        }
    } catch (error) {
        return res.status(400).send({message: "Error has occured"})
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

        await userModel.updateOne( 
            {_id }, 
            { 
                $set: { password }
            }
        )

        return res.status(200).send({message: "password was changed successfully"})
    } catch (error) {
        console.log(error)
        return res.status(400).send({message: "Invalid request"})
    }
}

module.exports = {
    createUser,
    findUser,
    updateUser,
    deleteUser,
    loginUser,
    change_password
}