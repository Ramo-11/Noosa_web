const user = require('../../model/user')
const bcrypt = require('bcryptjs')

// create new user
exports.createUser = async (req, res) => {
    const { name, email, password: plainTextPassword } = req.body
    console.log("body: ", req.body, "   name: ", name)

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
        await user.create({
            name,
            email,
            password
        }) 
    } catch (error) {
        if(error.code === 11000)
            res.status(400).send({message: "email already exists"})
        throw error
    }

    res.status(200).send({message: "user was created successfully"})
}

exports.findUser = async (req, res) => {
    try {
        user.find().then(newuser => res.send(newuser))
    } catch (error) {
        res.status(400).send({message: "unable to get data from database"})
    }
}

exports.updateUser = async (req, res) => {

}

exports.deleteUser = async (req, res) => {
    
}