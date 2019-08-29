import { getProviderByName } from '../providers'
import { createBbox, createSingleBandTile } from '../tiler'
import { findUniqueBandShortNamesInString } from '../utils'
import { getScene, openTiffImage } from '../cog'
import { getRampByName, createCustomRamp } from '../symbology'

export default async (req, res, next) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  const ratio = req.query.ratio ? req.query.ratio : null
  if (sceneId === null || ratio === null) throw new Error('GeoTiff-Server: You must pass in sceneId and ratio parameters to your query')

  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)

  var requestBbox = createBbox(Number(req.params.x), Number(req.params.y), Number(req.params.z))

  const style = req.query.style ? req.query.style : 'NDWI'

  let colorRamp = null
  if (style === 'custom') {
    colorRamp = createCustomRamp(req.query)
  } else {
    const classes = req.query.classes ? req.query.classes : null
    colorRamp = getRampByName(style, classes)
  }
  const requiredBandsShortNames = findUniqueBandShortNamesInString(ratio)

  const bandsToUse = provider.getRequiredBandsByShortNames(requiredBandsShortNames, sceneId)

  const getImageCalls = []

  for (var i = 0; i < bandsToUse.length; i++) {
    getImageCalls.push(openTiffImage(bandsToUse[i], provider))
  }
  await Promise.all(getImageCalls)

  const firstImage = await bandsToUse[0].tiff.getImage()
  const geotiffProps = firstImage.getGeoKeys()
  let imgBbox = null

  if (provider.requiresReprojecting) imgBbox = provider.reprojectBbbox(requestBbox, geotiffProps.GTCitationGeoKey)

  const getDataCalls = []
  for (var i = 0; i < bandsToUse.length; i++) {
    getDataCalls.push(getScene(bandsToUse[i], imgBbox))
  }
  await Promise.all(getDataCalls)
  const png = createSingleBandTile(bandsToUse, ratio, colorRamp)
  var img = Buffer.from(png.data, 'binary')

  res.contentType('image/jpeg')
  res.send(img)
}
