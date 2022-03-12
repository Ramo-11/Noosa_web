const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))

app.get('/', (req, res) => res.sendFile('./views/index.html', { root: __dirname }))
app.get('/about', (req, res) => res.sendFile('./views/about.html', { root: __dirname }))
app.get('/contact', (req, res) => res.sendFile('./views/contact.html', { root: __dirname }))
app.use((req,res) => res.status(404).sendFile('./views/404.html', { root: __dirname }))