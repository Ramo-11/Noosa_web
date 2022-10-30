const { dev_generalLogger, dev_databaseLogger, dev_mailLogger, dev_projectLogger, dev_userLogger } = require("./dev-loggers")
const { prod_generalLogger, prod_databaseLogger, prod_mailLogger, prod_projectLogger, prod_userLogger  } = require("./prod-loggers")
require("dotenv").config()

function getLoggerType(type) {
    try {
        if(process.env.NODE_ENV.trim() === "development")
            switch(type) {
                case "general":
                    return dev_generalLogger
                case "database":
                    return dev_databaseLogger
                case "mail":
                    return dev_mailLogger
                case "project":
                    return dev_projectLogger
                case "user":
                    return dev_userLogger
                default:
                    return dev_generalLogger
            }
        else 
            switch(type) {
                case "general":
                    return prod_generalLogger
                case "database":
                    return prod_databaseLogger
                case "mail":
                    return prod_mailLogger
                case "project":
                    return prod_projectLogger
                case "user":
                    return prod_userLogger
                default:
                    return prod_generalLogger
        }
    } catch (error) {
        return prod_generalLogger
    }
}

module.exports =  {
    getLoggerType
}