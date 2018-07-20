import fetch from 'node-fetch'

export class LandsatPdsProvider {
  constructor () {
    this.name = 'landsat-pds'
    this.baseUrl = 'http://landsat-pds.s3.amazonaws.com/L8'
    this.naturalColorBands = ['b4', 'b3', 'b2']
    this.bands = [
      {
        shortName: 'b1',
        commonName: 'Ultra Blue (coastal/aerosol)',
        resolution: 30,
        filePath: 'B1'
      },
      {
        shortName: 'b2',
        commonName: 'Blue',
        resolution: 30,
        filePath: 'B2'
      }
    ]
  }

  constructImageUrl (sceneId, bandShortName) {
    let bandPath = null
    for (var i = 0; i < this.bands.length; i++) {
      if (this.bands[i].shortName === bandShortName) {
        bandPath = this.bands[i].filePath
        break
      }
    }
    const path = sceneId.substring(3, 6)
    const row = sceneId.substring(6, 9)
    return `${this.baseUrl}/${path}/${row}/${sceneId}/${sceneId}_${bandPath}.TIF`
  }

  getBandUrls (sceneId, bands) {
    const urls = []
    for (var i = 0; i < bands.length; i++) {
      urls.push(this.constructImageUrl(sceneId, bands[i]))
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
}
