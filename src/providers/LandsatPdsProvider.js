import fetch from 'node-fetch'
import { latLonToUtm, degreesToRadians } from '../utils'

export class LandsatPdsProvider {
  constructor () {
    this.name = 'landsat-pds'
    this.baseUrl = 'http://landsat-pds.s3.amazonaws.com/L8'
    this.naturalColorBands = ['b4', 'b3', 'b2']
    this.bands = [
      {
        shortName: 'b1',
        bandNumber: 1,
        commonName: 'Ultra Blue (coastal/aerosol)',
        resolution: 30,
        filePath: 'B1'
      },
      {
        shortName: 'b2',
        bandNumber: 2,
        commonName: 'Blue',
        resolution: 30,
        filePath: 'B2'
      },
      {
        shortName: 'b3',
        bandNumber: 3,
        commonName: 'Green',
        resolution: 30,
        filePath: 'B3'
      },
      {
        shortName: 'b4',
        bandNumber: 4,
        commonName: 'Red',
        resolution: 30,
        filePath: 'B4'
      },
      {
        shortName: 'b5',
        bandNumber: 5,
        commonName: 'NIR',
        resolution: 30,
        filePath: 'B5'
      },
      {
        shortName: 'b6',
        bandNumber: 6,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B6'
      }
    ]
    this.requiresReprojecting = true
    this.requiresToaCorrection = true
  }

  constructImageUrl (sceneId, band) {
    const path = sceneId.substring(3, 6)
    const row = sceneId.substring(6, 9)
    return `${this.baseUrl}/${path}/${row}/${sceneId}/${sceneId}_${band.filePath}.TIF`
  }

  getBandByShortName (shortName) {
    for (var i = 0; i < this.bands.length; i++) {
      if (this.bands[i].shortName === shortName) return this.bands[i]
    }
  }

  getRequiredBandsByShortNames (bands, sceneId) {
    const requiredBands = []
    for (var i = 0; i < bands.length; i++) {
      const matchingBand = this.getBandByShortName(bands[i])
      matchingBand.urlPath = this.constructImageUrl(sceneId, matchingBand)
      requiredBands.push(matchingBand)
    }
    return requiredBands
  }

  getBandUrls (sceneId, bands) {
    const urls = []
    for (var i = 0; i < bands.length; i++) {
      urls.push({
        band: bands[i],
        url: this.constructImageUrl(sceneId, bands[i])
      })
    }
    return urls
  }

  async getMetadata (sceneId) {
    const path = sceneId.substring(3, 6)
    const row = sceneId.substring(6, 9)
    var metaUrl = `${this.baseUrl}/${path}/${row}/${sceneId}/${sceneId}_MTL.json`

    const res = await fetch(metaUrl, {
      timeout: 5000
    })
    const meta = await res.json()
    return meta
  }

  reprojectBbbox (requestBbox) {
    const sceneUtmZone = this.metadata.L1_METADATA_FILE.PROJECTION_PARAMETERS.UTM_ZONE
    const bboxMinUtm = latLonToUtm([requestBbox[0], requestBbox[1]], sceneUtmZone)
    const bboxMaxUtm = latLonToUtm([requestBbox[2], requestBbox[3]], sceneUtmZone)
    return [bboxMinUtm[0], bboxMinUtm[1], bboxMaxUtm[0], bboxMaxUtm[1]]
  }

  performToa (band) {
    const sunElevation = this.metadata.L1_METADATA_FILE.IMAGE_ATTRIBUTES.SUN_ELEVATION
    const se = Math.sin(degreesToRadians(sunElevation))
    const reflectanceRescalingFactor = this.metadata.L1_METADATA_FILE.RADIOMETRIC_RESCALING[`REFLECTANCE_MULT_BAND_${band.bandNumber}`]
    const reflectanceAddition = this.metadata.L1_METADATA_FILE.RADIOMETRIC_RESCALING[`REFLECTANCE_ADD_BAND_${band.bandNumber}`]

    for (var i = 0; i < band.data.length; i++) {
      band.data[i] = (((reflectanceRescalingFactor * band.data[i]) + reflectanceAddition) / se) * 1000
    }
  }

}
