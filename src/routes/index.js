import rgbTiles from './rgb'
import calculate from './calculate'
import express from 'express'

export const routes = express.Router()

routes.get('/', (req, res) => { res.status(200).json({ message: 'Connected!' }) })
routes.get('/tiles/:x/:y/:z.jpg', rgbTiles)
routes.get('/tiles/calculate/:x/:y/:z.jpg', calculate)
