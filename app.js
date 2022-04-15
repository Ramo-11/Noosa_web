// modules
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
require('dotenv').config()
const connectDB = require('./server/database/connection')
const User = require('./model/user')

app.use(express.static('public'))

// connectDB()

app.set('view engine', 'ejs')

app.listen(process.env.PORT, () => console.log(`Server running on port: http://localhost:${process.env.PORT}`))

app.use('/', require('./Server/router'))

app.use((req,res) => res.status(404).render('404'))