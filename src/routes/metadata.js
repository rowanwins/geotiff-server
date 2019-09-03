import { getProviderByName } from '../providers'
import { getSceneOverview } from '../cog'

import {min, max, quantile, standardDeviation} from 'simple-statistics'

export default async (req, res) => {
  const sceneId = req.query.sceneId ? req.query.sceneId : null
  if (sceneId === null) throw new Error('GeoTiff-Server: You must pass in a sceneId to your query')
  const providerSrc = req.query.provider ? req.query.provider : 'landsat-pds'
  const provider = getProviderByName(providerSrc)
  provider.metadata = await provider.getMetadata(sceneId)

  let imgBbox = provider.getBBox()

  const requiredBandsShortNames = req.query.bands ? req.query.bands.split(',') : provider.bands

  const bands = provider.getRequiredBandsByShortNames(requiredBandsShortNames, sceneId)
  const getDataCalls = []

  for (var i = 0; i < bands.length; i++) {
    getDataCalls.push(getSceneOverview(bands[i], imgBbox, provider))
  }

  const bandSummaries = await Promise.all(getDataCalls)

  const out = {
    bbox: imgBbox,
    wgsBbox: provider.getWgsBBox(),
    bandInformation: []
  }

  for (var i = 0; i < bandSummaries.length; i++) {
    out.bandInformation.push({
      bandName: requiredBandsShortNames[i].shortName,
      stats: getBasicStats(bandSummaries[i].data)
    })
  }
  res.json(out)
}

function getBasicStats (arr) {
  var filtered = arr.filter(function (element) {
    return element !== -999
  })
  return {
    percentiles: [quantile(filtered, 0.02), quantile(filtered, 0.98)],
    min: min(filtered),
    max: max(filtered),
    stdDeviation: standardDeviation(filtered)
  }
}
