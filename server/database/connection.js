const mongoose = require("mongoose")
const { getLoggerType } = require("../../utils/loggers/loggerType")
databaseLogger = getLoggerType("database")

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        databaseLogger.info(`MongoDB connected successfully: ${con.connection.host}`)
    } catch(error) {
        databaseLogger.error("unable to connect to database: are you sure the IP address is whitelisted in the database?\n")
        databaseLogger.debug(error)
    }
}

module.exports = connectDB