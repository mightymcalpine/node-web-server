const express = require('express')
const path = require('path')
const hbs = require('hbs')
const fs = require('fs')

const port = process.env.PORT || 3000
const app = express()

// ***** MIDDLEWARE *****
app.set('view engine', 'hbs')
// app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/node_modules')))
app.use(express.static(path.join(__dirname, '/images')))

hbs.registerPartials(path.join(__dirname, '/views/partials'))
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())
hbs.registerHelper('capitalizeTxt', (text) => text.toUpperCase())

app.use((req, res, next) => {
  const now = new Date().toString()
  const log = `${now} -- ${req.method} -- ${req.url}`
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log')
    }
  })
  next()
})
// when this middleware code is executed, only the maintence page is served up
// since next() is not called, not code, namely the routes below, get ran
app.use((req, res, next) => res.render('maintenance.hbs'))

// if you have any static html files in here, and you do not want them to load if the site is in maintenance mode
// then you need to move this line of code below you code that renders the maintenance page without the next() method
app.use(express.static(path.resolve('public')))

// ***** ROUTES *****
app.get('/', (req, res) => res.render('home.hbs', {
  title: 'New Heros 57',
  welcomeMsg: "It's time for some new Heros"
}))
app.get('/json', (req, res) => res.send({
  name: 'Lars',
  likes: [
    'biking',
    'photography',
    'playing with my sons'
  ]
}))
app.get('/bad', (req, res) => res.send('<h2 style="color: red">Error: Failed to fulfill request</h2>'))
app.get('/about', (req, res) => res.render('about.hbs', {
  title: 'About Page 57'
}))

const server = app.listen(port, () => console.log(`Server is listening on port: ${port}`))
