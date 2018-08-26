import { getProviderByName } from '../providers'
import { createBbox, createSingleBandTile } from '../tiler'
import { findUniqueBandShortNamesInString } from '../utils'
import { getScene } from '../cog'

export default async (req, res) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  if (sceneId === null) throw 'GeoTiff-Server: You must pass in a sceneId to your query' //eslint-disable-line

  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  provider.metadata = await provider.getMetadata(sceneId)

  var requestBbox = createBbox(Number(req.params.x), Number(req.params.y), Number(req.params.z))
  let imgBbox = requestBbox
  if (provider.requiresReprojecting) imgBbox = provider.reprojectBbbox(requestBbox)

  const style = req.query.style ? req.query.style : 'NDWI'

  const ratio = req.query.ratio ? req.query.ratio : '(b3-b5)/(b3+b5)'
  const requiredBandsShortNames = findUniqueBandShortNamesInString(ratio)

  const bandsToUse = provider.getRequiredBandsByShortNames(requiredBandsShortNames, sceneId)

  const getDataCalls = []
  for (var i = 0; i < bandsToUse.length; i++) {
    getDataCalls.push(getScene(bandsToUse[i], imgBbox, provider))
  }

  const data = await Promise.all(getDataCalls)

  const png = createSingleBandTile(data, ratio, style)
  var img = Buffer.from(png.data, 'binary')

  res.contentType('image/jpeg')
  res.send(img)
}
