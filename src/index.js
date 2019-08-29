import 'babel-polyfill'

import { routes } from './routes'

// Setup the expressjs server
import express from 'express'
import serverless from 'serverless-http'
import expressAsync from 'express-async-errors' //eslint-disable-line

var app = express()
app.use('/', routes)

module.exports.handler = serverless(app, {
  binary: ['image/png', 'image/jpeg']
})

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
}
