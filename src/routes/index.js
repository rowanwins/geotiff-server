import rgbTiles from './rgb'
import calculate from './calculate'
import metadata from './metadata'
import express from 'express'

export const routes = express.Router()

routes.get('/', (req, res) => { res.status(200).json({ message: 'Connected!' }) })
routes.get('/metadata', metadata)
routes.get('/tiles/:x/:y/:z.jpeg', rgbTiles)
routes.get('/tiles/calculate/:x/:y/:z.jpeg', calculate)
