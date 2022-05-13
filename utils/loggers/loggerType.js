const { dev_generalLogger, dev_authLogger, dev_databaseLogger, dev_mailLogger } = require('./dev-loggers')
const { prod_generalLogger, prod_authLogger, prod_databaseLogger, prod_mailLogger } = require('./prod-loggers')

function getLoggerType(type) {
    if(process.env.NODE_ENV.trim() === 'development')
        switch(type) {
            case 'general':
                logger = dev_generalLogger
            case 'authentication':
                logger = dev_authLogger
            case 'database':
                logger = dev_databaseLogger
                break;
            case 'mail':
                logger = dev_mailLogger
                break
            default:
                logger = dev_generalLogger
        }
    else 
        switch(type) {
            case 'general':
                logger = prod_generalLogger
                break;
            case 'authentication':
                logger = prod_authLogger
                break;
            case 'database':
                logger = prod_databaseLogger
                break;
            case 'mail':
                logger = prod_mailLogger
                break
            default:
                logger = prod_generalLogger
    }
    return logger
}

module.exports =  {
    getLoggerType
}