const express = require('express')
const route = express.Router()

const dbController = require('./controllers/dbController')

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
 * @description login route
 * @method GET /login
 */
route.get('/login', (req, res) => res.render('login'))

/**
 * @description signup route
 * @method GET /signup
 */
route.get('/signup', (req, res) => res.render('signup'))

// API Routes
route.post('/api/signup', dbController.createUser)
route.get('/api/signup', dbController.findUser)
route.put('/api/signup:id', dbController.updateUser)
route.delete('/api/signup:id', dbController.deleteUser)

module.exports = route