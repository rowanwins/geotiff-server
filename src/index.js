import { LandsatPdsProvider } from './providers/LandsatPdsProvider'
import { findUniqueBandShortNamesInString, latLonToUtm } from './utils' //eslint-disable-line
import { xyzToBbox } from './toTile'

var GeoTIFF = require('geotiff')
var express = require('express')
require('express-async-errors')

const port = process.env.PORT || 5000
var app = express()

const providers = [new LandsatPdsProvider()]

app.get('/', (req, res) => {
  res.send('hello world')
})

/**
 * @api {get} /tiles/:x/:y/:z Request tile
 * @apiName GetTile
 * @apiGroup Tiles
 *
 * @apiParam {Number} x Slippy map tile x property
 * @apiParam {Number} y Slippy map tile y property
 * @apiParam {Number} z Slippy map zoom level
 * @apiParam (Query string) {String} sceneId The scene id for your to find in your dataset. Eg:
 * ```
 * sceneId=LC81390452014295LGN00
 * ```
 * @apiParam (Query string) {String} provider The name of provider of the dataset that you'll query Eg:
 * ```
 * provider=landsat-pds
 * ```
 * @apiParam (Query string) {String} mode[SELECTOR] The mode for rendering the image.
 * Available selectors: rgb (default), calculate. Eg:
 * ```
 * mode=rgb
 * ```
 *
 * @apiSuccess {Image} an png image
 * @apiError {Text} TileNotFound The id of the User was not found.
 *
 */
app.get('/tiles/:x/:y/:z', async (req, res) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  if (sceneId === null) throw 'GeoTiff-Server: You must pass in a sceneId to your query' //eslint-disable-line

  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  const bbox = xyzToBbox(req.params.x, req.params.y, req.params.z)
  // temporary windows fix
  const bbox2 = xyzToBbox(req.params.x - 1, req.params.y, req.params.z)
  bbox[2] = bbox2[2]

  const sceneMeta = await provider.getMetadata(sceneId)
  const sceneUtmZone = sceneMeta.L1_METADATA_FILE.PROJECTION_PARAMETERS.UTM_ZONE

  const bboxMinUtm = latLonToUtm([bbox[0], bbox[1]], sceneUtmZone)
  const bboxMaxUtm = latLonToUtm([bbox[2], bbox[3]], sceneUtmZone)

  const bboxUtm = [bboxMinUtm[0], bboxMinUtm[1], bboxMaxUtm[0], bboxMaxUtm[1]]
  console.log(bboxUtm)

  const mode = req.query.mode ? req.query.mode : 'rgb'

  let requiredBandsShortNames = []

  if (mode === 'rgb') {
    requiredBandsShortNames = req.query.rgbBands ? req.query.rgbBands.split(',') : provider.naturalColorBands
  }
  // // if (mode === 'calculate') {
  // //     const ratio = req.query.ratio ? req.query.ratio : '(b5-b4)/(b5+b4)'
  // //     requiredBandsShortNames = findUniqueBandShortNamesInString(ratio) //Only get the unique bands
  // // }

  const imagesToQuery = provider.getBandUrls(sceneId, requiredBandsShortNames)

  console.log(imagesToQuery)

  for (var i = 0; i < imagesToQuery.length; i++) {
    const data = await getScene(imagesToQuery[i].url, bboxUtm)
    console.log(JSON.stringify(data[0][0]))
  }

  res.send('hello world')
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

async function getScene (url, bbox) {
  const tiff = await GeoTIFF.fromUrl(url)
  const data = await tiff.readRasters({ bbox: bbox })
  return data
}

function getProviderByName (providerSrc) {
  for (var i = 0; i < providers.length; i++) {
    if (providers[i].name === providerSrc) {
      return providers[i]
    }
  }
}
