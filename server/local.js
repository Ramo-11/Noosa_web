const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("../model/user")
const bcrypt = require("bcryptjs");

const { getLoggerType } = require("../utils/loggers/loggerType")
userLogger = getLoggerType("user")

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error("user was not found")
        return done(null, user)
    } catch(error) {
        userLogger.error("unable to deserialize user")
        userLogger.debug(error)
        return done(error, null)
    }
})

passport.use(
    new Strategy({
        usernameField: "email"
    }, async function (email, password, done) {
        try {
            if(email && password) {
                const user = await User.findOne({ email }).lean()
                if(!user)
                    throw new Error("User was not found with the given email")
                if(await bcrypt.compare(password, user.password)) {
                    userLogger.info("user with email [" + email + "] logged in successfully")
                    return done(null, user)
                }
                else 
                    throw new Error("Password is incorrect")
            }
            else
                throw new Error("Email and password must not be empty")
        } catch (error) {
            userLogger.error("Unable to log user in")
            userLogger.debug(error)
            return done(null, false, { message: error.message })
        }
    })
)

function logUserIn(req, res, next) {
    passport.authenticate("local", function(error, user, info) {
        if (error) {
            userLogger.error("Unable to log user in")
            userLogger.debug(error)
            return next(error) // will generate a 500 error
        }
            // usually this means missing credentials
        if (!user) {
            userLogger.error("Unable to log user in")
            userLogger.debug(info.message)
            return res.status(400).send({ message: info.message })
        }
        req.login(user, loginErr => {
            if (loginErr)
                return next(loginErr)
            return res.status(200).send({ message: "User was logged in successfully" })
        }) 
    }) (req, res, next)
}

function logUserOut(req, res) {
    req.logout(function(error) {
        if (error) {
            userLogger.error("Unable to log user out")
            userLogger.debug(error)
            return next(error)
        }
        userLogger.info("user has been logged out")
        return res.redirect("/signup_and_login")
    })
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/signup_and_login")
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/")
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    logUserIn,
    logUserOut
}