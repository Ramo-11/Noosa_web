const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("../model/user")
const bcrypt = require("bcryptjs");

const { getLoggerType } = require("../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error("user was not found")
        return done(null, user)
    } catch(error) {
        authLogger.error("unable to deserialize user: user was not found")
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
                    authLogger.info("user logged in successfully")
                    return done(null, user)
                }
                else 
                    throw new Error("Password is incorrect")
            }
            else
                throw new Error("Email and password must not be empty")
        } catch (error) {
            authLogger.error(error)
            return done(null, false, { message: error.message })
        }
    })
)

function logUserIn(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err)
            return next(err) // will generate a 500 error
            // usually this means missing credentials
        if (!user)
            return res.status(400).send({ message: info.message })
        req.login(user, loginErr => {
            if (loginErr)
                return next(loginErr)
            authLogger.info("user was logged in successfully")
            return res.status(200).send({ message: "User was logged in successfully" })
        }) 
    }) (req, res, next)
}

function logUserOut(req, res) {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        authLogger.debug("user has been logged out")
        return res.redirect("/signup_and_login")
    })
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next()
    return res.redirect("/signup_and_login")
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated())
        return next()
    return res.redirect("/")
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    logUserIn,
    logUserOut
}