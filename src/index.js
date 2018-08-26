import 'babel-polyfill'
import { routes } from './routes'

// Setup the expressjs server
var express = require('express')
require('express-async-errors')

// Set up the imagery providers
import providers from './providers'

const port = process.env.PORT || 5000

var app = express()
app.use('/', routes)

// module.exports = app

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
