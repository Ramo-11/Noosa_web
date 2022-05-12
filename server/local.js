const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../model/user')
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger')

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error('user was not found')
        return done(null, user)
    } catch(error) {
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
                    throw new Error('user was not found with the given email')
                if(await bcrypt.compare(password, user.password)) {
                    logger.info('user logged in successfully')
                    return done(null, user)
                }
                else
                    throw new Error('password is incorrect')
            }
            else
                throw new Error('email and password must not be empty')
        } catch (error) {
            logger.error(error)
            return done(error, null)
        }
    })
)

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        logger.debug('user is logged in')
        return next()
    }
    return res.redirect('/signup_and_login')
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()) {
        logger.debug('user is logged out')
        return next()
    }
    return res.redirect('/')
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}