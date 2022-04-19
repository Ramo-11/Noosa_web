const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected successfully: ${con.connection.host}`)
    } catch(error) {
        console.log("unable to connect to database: are you sure the IP address is whitelisted in the database?\n\n", error)
    }
}

module.exports = connectDB