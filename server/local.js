const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../model/user')
const bcrypt = require('bcryptjs');
const fs = require('fs')

const { getLoggerType } = require('../utils/loggers/loggerType')
authLogger = getLoggerType('authentication')

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error('user was not found')
        return done(null, user)
    } catch(error) {
        authLogger.error('unable to deserialize user: user was not found')
        return done(error, null)
    }
})

passport.use(
    new Strategy({
        usernameField: 'email'
    }, async function (email, password, done) {
        try {
            if(email && password) {
                const user = await User.findOne({ email }).lean()
                if(!user)
                    throw new Error('User was not found with the given email')
                if(await bcrypt.compare(password, user.password)) {
                    authLogger.info('user logged in successfully')
                    return done(null, user)
                }
                else 
                    throw new Error('Password is incorrect')
            }
            else
                throw new Error('Email and password must not be empty')
        } catch (error) {
            authLogger.error(error)
            return done(null, false, { message: error.message })
        }
    })
)

function logUserOut(req, res) {
    req.logout()
    authLogger.debug('user has been logged out')
    return res.redirect('/signup_and_login')
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next()
    return res.redirect('/signup_and_login')
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated())
        return next()
    return res.redirect('/')
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    logUserOut
}