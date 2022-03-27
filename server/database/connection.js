const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected successfully: ${con.connection.host}`)
    } catch(error) {
        console.log("exception caught: ", error)
    }
}

module.exports = connectDB