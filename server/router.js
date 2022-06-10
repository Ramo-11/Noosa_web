const express = require('express')
const route = express.Router()

const { isLoggedIn, isLoggedOut, logUserOut } = require('./local')

const { createUser, findUser, updateUser, deleteUser, change_password } = require('./controllers/UserController')
const sendEmail = require('./controllers/mailController')
const passport = require('passport')

const { getLoggerType } = require('../utils/loggers/loggerType')
generalLogger = getLoggerType('general')
authLogger = getLoggerType('authentication')

/**
 * @description home route
 * @method GET /
 */
route.get('/', (req, res) => { 
  if (res.req.user != undefined)
    res.render('index', { user: res.req.user.name }) 
  else
    res.render('index', { user: 'nouser'})
})

/**
 * @description about route
 * @method GET /about
 */
route.get('/about', (req, res) => res.render('about'))

/**
 * @description contact route
 * @method GET /contact
 */
route.get('/contact', (req, res) => res.render('contact'))

/**
 * @description signup and login route
 * @method GET /signup_and_login
 */
route.get('/signup_and_login', isLoggedOut, (req, res) => res.render('signup_and_login'))

// API Routes
route.post('/api/signup', isLoggedOut, createUser)
route.get('/api/signup', findUser)
route.put('/api/signup/:id', updateUser)
route.delete('/api/signup/:id', deleteUser)

route.post('/api/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err)
        return next(err) // will generate a 500 error
      // usually this means missing credentials
      if (!user)
        return res.status(400).send({ message: info.message })
      req.login(user, loginErr => {
        if (loginErr)
          return next(loginErr)
        authLogger.info('user was logged in successfully')
        return res.status(200).send({ message: 'User was logged in successfully' })
      }) 
    }) (req, res, next)
  })

route.post('/api/logout', logUserOut)
route.post('/api/change_password', change_password)

route.post('/api/sendemail', sendEmail)

module.exports = route