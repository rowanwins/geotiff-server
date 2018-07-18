var express = require('express');
var GeoTIFF = require('geotiff');
const PORT = process.env.PORT || 5000
var app = express();

import { LandsatPdsProvider } from './providers/LandsatPdsProvider'
import { findUniqueBandShortNamesInString } from './utils' 
import { xyzToBbox } from './toTile'

const providers = [new LandsatPdsProvider()]

app.get('/', function (req, res) {
  res.send('hello world');
})

app.get('/tiles/:x/:y/:z', function(req, res){
  console.log("SDF")
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  if (sceneId === null) throw 'GeoTiff-Server: You must pass in a sceneId to your query'
 
  const bbox = xyzToBbox(req.params.x, req.params.y, req.params.z) 
  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  const mode = req.query.mode ? req.query.mode : 'rgb'

  let requiredBandsShortNames = []

  if (mode === 'rgb') {
    requiredBandsShortNames = req.query.rgbBands ? req.query.rgbBands.split(',') : provider.naturalColorBands
  } 

  if (mode === 'calculate') {
      const ratio = req.query.ratio ? req.query.ratio : '(b5-b4)/(b5+b4)'
      requiredBandsShortNames = findUniqueBandShortNamesInString(ratio) //Only get the unique bands
  }
  const imagesToQuery = provider.getBandUrls(sceneId, requiredBandsShortNames)
  console.log(imagesToQuery)
  // for (var i = 0; i < imagesToQuery.length; i++) {
    GeoTIFF.fromUrl(imagesToQuery[0])
      .then(function (tiff) {
        console.log(tiff)
      })
      .catch((err) => {
        console.log(err);
      });
  // }



  res.send('hello world');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


function getProviderByName(providerSrc) {
  for (var i = 0; i < providers.length; i++) {
    if (providers[i].name === providerSrc) {
      return providers[i]
    }
  }
}
