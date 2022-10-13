const { createLogger, transports, format } = require("winston")

const customFormat = format.combine(
    format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    format.printf((info) => {
    return `${info.timestamp} = [${info.level.toUpperCase().padEnd(6)}] - ${info.message}`
}))

const dev_authLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({filename: "./logs/dev_authentication.log", level: "silly"})
    ]
})

const dev_databaseLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({filename: "./logs/dev_database.log", level: "silly"})
    ]
})

const dev_generalLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({filename: "./logs/dev_general.log", level: "silly"})
    ]
})

const dev_mailLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({filename: "./logs/dev_mail.log", level: "silly"})
    ]
})

const dev_projectLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({filename: "./logs/dev_project.log", level: "silly"})
    ]
})

module.exports = {
    dev_authLogger,
    dev_databaseLogger,
    dev_generalLogger,
    dev_mailLogger,
    dev_projectLogger
}

