import fetch from 'node-fetch'
import yaml from 'js-yaml'
import { latLonToUtm } from '../utils'

export class DeaProvider {
  constructor () {
    this.name = 'DEA'
    this.baseUrl = 'http://dea-public-data.s3-ap-southeast-2.amazonaws.com/L2/sentinel-2-nrt/'
    this.naturalColorBands = ['b4', 'b3', 'b2']
    this.bands = [
      {
        shortName: 'b1',
        bandNumber: 1,
        commonName: 'Ultra Blue (coastal/aerosol)',
        resolution: 30,
        filePath: 'B01'
      },
      {
        shortName: 'b2',
        bandNumber: 2,
        commonName: 'Blue',
        resolution: 30,
        filePath: 'B02'
      },
      {
        shortName: 'b3',
        bandNumber: 3,
        commonName: 'Green',
        resolution: 30,
        filePath: 'B03'
      },
      {
        shortName: 'b4',
        bandNumber: 4,
        commonName: 'Red',
        resolution: 30,
        filePath: 'B04'
      },
      {
        shortName: 'b5',
        bandNumber: 5,
        commonName: 'NIR',
        resolution: 30,
        filePath: 'B05'
      },
      {
        shortName: 'b6',
        bandNumber: 6,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B06'
      },
      {
        shortName: 'b7',
        bandNumber: 7,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B07'
      },
      {
        shortName: 'b8',
        bandNumber: 8,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B08'
      },
      {
        shortName: 'b9',
        bandNumber: 9,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B09'
      },
      {
        shortName: 'b10',
        bandNumber: 10,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B10'
      },
      {
        shortName: 'b11',
        bandNumber: 11,
        commonName: 'SWIR-1',
        resolution: 30,
        filePath: 'B11'
      }
    ]
    this.requiresReprojecting = true
    this.requiresToaCorrection = true
  }

  constructImageUrl (sceneId, band) {
    // var basepath = 'http://dea-public-data.s3-ap-southeast-2.amazonaws.com/L2/sentinel-2-nrt/S2MSIARD/2018-08-21/S2A_OPER_MSI_ARD_TL_SGS__20180821T013813_A016515_T56KKB_N02.06/LAMBERTIAN/LAMBERTIAN_'
    const part = sceneId.split('__')[1]
    const date = part.substring(0, 8)
    const year = date.substring(0, 4)
    const month = date.substring(4, 6)
    const day = date.substring(6, 8)
    return `${this.baseUrl}S2MSIARD/${year}-${month}-${day}/${sceneId}/LAMBERTIAN/LAMBERTIAN_${band.filePath}.TIF`
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
    // var metaUrl = 'http://dea-public-data.s3-ap-southeast-2.amazonaws.com/L2/sentinel-2-nrt/S2MSIARD/2018-08-21/S2A_OPER_MSI_ARD_TL_SGS__20180821T013813_A016515_T56KKB_N02.06/ARD-METADATA.yaml'
    const part = sceneId.split('__')[1]
    const date = part.substring(0, 8)
    const year = date.substring(0, 4)
    const month = date.substring(4, 6)
    const day = date.substring(6, 8)
    const metaUrl = `${this.baseUrl}S2MSIARD/${year}-${month}-${day}/${sceneId}/ARD-METADATA.yaml`
    const res = await fetch(metaUrl, {
      timeout: 5000
    })
    let meta = await res.text()
    meta = yaml.safeLoad(meta)
    return meta
  }

  reprojectBbbox (requestBbox) {
    const sceneSpatialRef = this.metadata.grid_spatial.projection.spatial_reference
    const zoneHemi = sceneSpatialRef.split('UTM zone ')[1]
    const sceneUtmZone = zoneHemi.substring(0, 2)
    const bboxMinUtm = latLonToUtm([requestBbox[0], requestBbox[1]], sceneUtmZone, true)
    const bboxMaxUtm = latLonToUtm([requestBbox[2], requestBbox[3]], sceneUtmZone, true)
    return [bboxMinUtm[0], bboxMinUtm[1], bboxMaxUtm[0], bboxMaxUtm[1]]
  }

  performToa (band) {
    const tmp = new Float32Array(band.data.length)
    for (var i = 0; i < band.data.length; i++) {
      tmp[i] = band.data[i] / 2600
      band.data[i] = Math.round(tmp[i] * 255)
    }
  }

}
