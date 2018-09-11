import { getProviderByName } from '../providers'
import { createBbox, createRgbTile } from '../tiler'
import { getScene } from '../cog'

export default async (req, res) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  if (sceneId === null) throw new Error('GeoTiff-Server: You must pass in a sceneId to your query')

  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  provider.metadata = await provider.getMetadata(sceneId)
  var requestBbox = createBbox(Number(req.params.x), Number(req.params.y), Number(req.params.z))
  let imgBbox = requestBbox
  if (provider.requiresReprojecting) imgBbox = provider.reprojectBbbox(requestBbox)

  const requiredBandsShortNames = req.query.rgbBands ? req.query.rgbBands.split(',') : provider.naturalColorBands

  const bandsToUse = provider.getRequiredBandsByShortNames(requiredBandsShortNames, sceneId)

  const getDataCalls = []
  for (var i = 0; i < bandsToUse.length; i++) {
    getDataCalls.push(getScene(bandsToUse[i], imgBbox, provider))
  }
  const [r, g, b] = await Promise.all(getDataCalls)

  const png = createRgbTile(r.data, g.data, b.data)
  var img = Buffer.from(png.data, 'binary')

  res.contentType('image/jpeg')
  res.send(img)

}
