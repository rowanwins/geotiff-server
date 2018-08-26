'use strict'

const Lambundaler = require('lambundaler')

Lambundaler({
  entry: './dist/geotiff-server.js',
  export: 'app',
  output: './dist/bundle.zip'
}, (err, buffer, artifacts) => {
  if (err) {
    console.error(err)
  }
})
