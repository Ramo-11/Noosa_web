const { createLogger, transports, format } = require("winston")
const { timestamp, combine, errors, json } = format

const prod_authLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_authentication.log", level: "silly"})
    ]
})

const prod_databaseLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_database.log", level: "silly"})
    ]
})

const prod_generalLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_general.log", level: "silly"})
    ]
})

const prod_mailLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_mail.log", level: "silly"})
    ]
})

const prod_projectLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_project.log", level: "silly"})
    ]
})

const prod_userLogger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({filename: "./logs/prod_user.log", level: "silly"})
    ]
})

module.exports = {
    prod_authLogger,
    prod_databaseLogger,
    prod_generalLogger,
    prod_mailLogger,
    prod_projectLogger,
    prod_userLogger
}

