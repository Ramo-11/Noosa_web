const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../model/user')
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error('User was not found')
        done(null, user)
    } catch(error) {
        done(error, null)
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
                if(await bcrypt.compare(password, user.password))
                    done(null, user)
                else
                    throw new Error('Password is incorrect')
            }
            else
                throw new Error('Email and password must not be empty')
        } catch (error) {
            done(error, null)
        }
    })
)

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next()
    res.redirect('/signup_and_login')
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated())
        return next()
    res.redirect('/')
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}