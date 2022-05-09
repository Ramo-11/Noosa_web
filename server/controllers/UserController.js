const userModel = require('../../model/user')
const bcrypt = require('bcryptjs');
const { send } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
const JWT_SECRET = 'kasdkfjioe.,mncv xkio@#@#%#$#nbsw#$knlk23@@3kln3%#4323nk'

// create new userModel
exports.createUser = async (req, res) => {
    const { name, email, password: plainTextPassword } = req.body

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    if(!name)
        return res.status(400).send({message: "name cannot be empty"})
    if(!email || typeof email !== 'string' || !validateEmail(email))
        return res.status(400).send({message: "invalid email"})
    passwordCheck = verifyPassword(plainTextPassword)
    if(passwordCheck !== "password is good")
        return res.state(400).send({message: passwordCheck})

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

exports.findUser = async (req, res) => {
    try {
        const user = await userModel.find()
        return res.json(user)
    } catch (error) {
        return res.status(400).send({message: "unable to get data from database"})
    }
}

exports.updateUser = async (req, res) => {
    const userID = req.params.id
    try {
        await userModel.findByIdAndUpdate(userID, req.body)
        return res.status(200).send({message: "user was updated successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to update user"})
    }
}

exports.deleteUser = async (req, res) => {
    const userID = req.params.id
    try {
        await userModel.findByIdAndDelete(userID)
        return res.status(200).send({message: "users were deleted successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to delete user"})
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email }).lean()
        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({id: user._id, username: user.email}, JWT_SECRET)
            res.status(200)
            return res.json({data: token})
        }
        else {
            return res.status(400).send({message: "invalid email/password"})
        }
    } catch (error) {
        return res.status(400).send({message: "error has occured"})
    }
}

exports.fakeLogin = async(req, res) => {
    const { email, password } = req.body
    if(email && password) {
        if(req.session.user)
            return res.status(200).send({message: "You are already logged in"})
        else {
            req.session.user = {
                email,
            }
            return res.status(200).send(req.session)
        }
    }
    else {
        return res.status(400).send({message: "you suck"})
    }
}

exports.change_password = async (req, res) => {
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

function verifyPassword(password) {
    if(!password || typeof password !== 'string') 
        return "invalid password"
    if(password <= 5)
        return "password is too short (it should be at least 6 characters)"

    return "password is good"
}