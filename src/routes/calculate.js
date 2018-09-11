import { getProviderByName } from '../providers'
import { createBbox, createSingleBandTile } from '../tiler'
import { findUniqueBandShortNamesInString } from '../utils'
import { getScene } from '../cog'
import { getRampByName } from '../symbology'

export default async (req, res, next) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  const ratio = req.query.ratio ? req.query.ratio : null

  if (sceneId === null || ratio === null) throw new Error('GeoTiff-Server: You must pass in sceneId and ratio parameters to your query')

  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  provider.metadata = await provider.getMetadata(sceneId)

  var requestBbox = createBbox(Number(req.params.x), Number(req.params.y), Number(req.params.z))
  let imgBbox = requestBbox
  if (provider.requiresReprojecting) imgBbox = provider.reprojectBbbox(requestBbox)

  const style = req.query.style ? req.query.style : 'NDWI'
  const classes = req.query.classes ? req.query.classes : null
  const colorRamp = getRampByName(style, classes)

  const requiredBandsShortNames = findUniqueBandShortNamesInString(ratio)

  const bandsToUse = provider.getRequiredBandsByShortNames(requiredBandsShortNames, sceneId)

  const getDataCalls = []
  for (var i = 0; i < bandsToUse.length; i++) {
    getDataCalls.push(getScene(bandsToUse[i], imgBbox, provider))
  }

  const data = await Promise.all(getDataCalls)

  const png = createSingleBandTile(data, ratio, colorRamp)
  var img = Buffer.from(png.data, 'binary')

  res.contentType('image/jpeg')
  res.send(img)
}
