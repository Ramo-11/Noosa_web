// modules
const express = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const app = express()
const User = require('./model/user')

app.use(express.static('public'))
app.use(express.json())

const PORT = 3000

const URL = "mongodb+srv://omar:omar_noosa_03252022@noosashare.zpvrg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(URL, {
     useNewUrlParser: true 
}).then(() => console.log('MongoDB Connected')).catch(err => console.log('Mongo Error:' + err));

app.set('view engine', 'ejs')

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))

app.get('/', (req, res) => res.render('index'))
app.get('/about', (req, res) => res.render('about'))
app.get('/contact', (req, res) => res.render('contact'))
app.get('/signup', (req, res) => res.render('signup'))
app.post('/api/register', async (req, res) => {
     console.log(req.body)
     const { username, password: plainTextPassword } = req.body
     const password = await bcrypt.hash(plainTextPassword, 10)

     try {
          await User.create({
               username,
               password
          }) 
     } catch (error) {
          console.log(error)
          return res.json({ status: 'error' })
     }

     res.json({status: 'ok'})
})
app.use((req,res) => res.status(404).render('404'))