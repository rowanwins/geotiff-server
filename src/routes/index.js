import rgbTiles from './rgb'
import calculate from './calculate'

export const routes = require('express').Router()

routes.get('/', (req, res) => { res.status(200).json({ message: 'Connected!' }) })
routes.get('/tiles/:x/:y/:z', rgbTiles)
routes.get('/tiles/calculate/:x/:y/:z', calculate)
