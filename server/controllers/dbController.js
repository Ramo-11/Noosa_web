const userModel = require('../../model/user')
const bcrypt = require('bcryptjs')

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
    if(!plainTextPassword || typeof plainTextPassword !== 'string') 
        return res.status(400).send({message: "invalid password"})
    if(plainTextPassword <= 5)
        return res.status(400).send({message: "password is too short (it should be at least 6 characters)"})

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await userModel.create({
            name,
            email,
            password
        }) 
        res.status(200).send({message: "user was created successfully"})
    } catch (error) {
        console.log("exception caught: unable to create user")
        if(error.code === 11000)
            res.status(400).send({message: "email already exists"})
        else
            res.status(400).send({message: "unable to create user"})
    }
}

exports.findUser = async (req, res) => {
    try {
        const user = await userModel.find()
        res.json(user)
    } catch (error) {
        console.log("exception caught: unable to retrieve users")
        res.status(400).send({message: "unable to get data from database"})
    }
}

exports.updateUser = async (req, res) => {
    const userID = req.params.id
    try {
        await userModel.findByIdAndUpdate(userID, req.body)
        res.status(200).send({message: "user was updated successfully"})
    } catch (error) {
        console.log("exception caught: unable to update user")
        res.status(400).send({message: "unable to update user", error})
    }
}

exports.deleteUser = async (req, res) => {
    const userID = req.params.id
    try {
        await userModel.findByIdAndDelete(userID)
        res.status(200).send({message: "users were deleted successfully"})
    } catch (error) {
        console.log("exception caught: unable to delete user")
        res.status(400).send({message: "unable to delete user", error})
    }
}