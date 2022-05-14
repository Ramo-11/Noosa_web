const { dev_generalLogger, dev_authLogger, dev_databaseLogger, dev_mailLogger } = require('./dev-loggers')
const { prod_generalLogger, prod_authLogger, prod_databaseLogger, prod_mailLogger } = require('./prod-loggers')

function getLoggerType(type) {
    if(process.env.NODE_ENV.trim() === 'development')
        switch(type) {
            case 'general':
                return dev_generalLogger
            case 'authentication':
                return dev_authLogger
            case 'database':
                return dev_databaseLogger
            case 'mail':
                return dev_mailLogger
            default:
                return dev_generalLogger
        }
    else 
        switch(type) {
            case 'general':
                return prod_generalLogger
            case 'authentication':
                return prod_authLogger
            case 'database':
                return prod_databaseLogger
            case 'mail':
                return prod_mailLogger
            default:
                return prod_generalLogger
    }
}

module.exports =  {
    getLoggerType
}