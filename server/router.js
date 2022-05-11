const express = require('express')
const route = express.Router()

const { isLoggedIn, isLoggedOut } = require('./local')

const { createUser, findUser, updateUser, deleteUser, loginUser, change_password } = require('./controllers/UserController')
const sendEmail = require('./controllers/mailController')
const passport = require('passport')

/**
 * @description home route
 * @method GET /
 */
route.get('/', isLoggedIn, (req, res) => res.render('index'))

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

route.post('/api/login', isLoggedOut, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup_and_login',
}))
route.post('/api/change_password', change_password)

route.post('/api/sendemail', sendEmail)

module.exports = route