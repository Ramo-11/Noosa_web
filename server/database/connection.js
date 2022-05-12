const mongoose = require('mongoose')
const logger = require('../../utils/logger')

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        logger.info(`MongoDB connected successfully: ${con.connection.host}`)
    } catch(error) {
        logger.error('unable to connect to database: are you sure the IP address is whitelisted in the database?\n')
    }
}

module.exports = connectDB