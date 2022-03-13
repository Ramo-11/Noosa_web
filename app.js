// modules
const express = require('express')
const path = require('path')

// express app
const app = express()

// constants 
const PORT = 3000

app.set('view engine', 'ejs')

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))

app.get('/', (req, res) => res.render('index'))
app.get('/about', (req, res) => res.render('about'))
app.get('/contact', (req, res) => res.render('contact'))
app.use((req,res) => res.status(404).render('404'))