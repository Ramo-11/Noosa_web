const express = require('express')
const route = express.Router()

const dbUserController = require('./controllers/dbUserController')
const mailController = require('./controllers/mailController')

/**
 * @description home route
 * @method GET /
 */
route.get('/', (req, res) => res.render('index'))

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
route.get('/signup_and_login', (req, res) => res.render('signup_and_login'))

/**
 * @description change password route
 * @method GET /change_password
 */
// route.get('/change_password', (req, res) => res.render('change_password'))

// API Routes
route.post('/api/signup', dbUserController.createUser)
route.get('/api/signup', dbUserController.findUser)
route.put('/api/signup/:id', dbUserController.updateUser)
route.delete('/api/signup/:id', dbUserController.deleteUser)

route.post('/api/login', dbUserController.loginUser)
route.post('/api/change_password', dbUserController.change_password)

route.post('/api/sendemail', mailController.sendemail)

module.exports = route