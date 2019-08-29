import geotiff from 'geotiff'
let path = require('path')

export async function openTiffImage (band, bbox, provider) {
  try {
    if (process.env.NODE_ENV === 'testLocal') {
      band.tiff = await geotiff.fromFile(path.join(__dirname, 'test', 'harness', path.basename(band.urlPath)))
    } else {
      band.tiff = await geotiff.fromUrl(band.urlPath)
      return band
    }
  } catch (err) {
    throw err
  }
}

export async function getScene (band, bbox) {
  try {
    const data = await band.tiff.readRasters({
      bbox: bbox,
      width: 256,
      height: 256
    })
    band.data = data[0]
    return band
  } catch (err) {
    throw err
  }
}

export async function getSceneOverview (band, bbox, provider) {
  try {
    let tiff = null
    if (process.env.NODE_ENV === 'testLocal') {
      tiff = await geotiff.fromFile(path.join(__dirname, 'test', 'harness', path.basename(band.urlPath)))
    } else {
      tiff = await geotiff.fromUrl(band.urlPath)
    }
    const image = await tiff.getImage()
    band.meta = image.getGDALMetadata()
    const data = await tiff.readRasters({
      bbox: bbox,
      width: 1024,
      height: 1024
    })
    band.data = Object.values(data[0])
    return band
  } catch (err) {
    throw err
  }
}
