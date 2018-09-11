import GeoTIFF from 'geotiff/dist/bundle-node.js'  //eslint-disable-line
let path = require('path')

export async function getScene (band, bbox, provider) {
  try {

    let tiff = null
    if (process.env.NODE_ENV === 'testLocal') {
      tiff = await GeoTIFF.fromFile(path.join(__dirname, 'test', 'harness', path.basename(band.urlPath)))
    } else {
      tiff = await GeoTIFF.fromUrl(band.urlPath)
    }
    // const tiff = await GeoTIFF.fromUrl(band.urlPath)
    const image = await tiff.getImage()
    band.meta = image.getGDALMetadata()

    const data = await tiff.readRasters({
      bbox: bbox,
      width: 256,
      height: 256
    })
      
    band.data = Object.values(data[0])
    // Was this previously - maybe something dodgy in my work upstream...
    // band.data = data[0]
    if (provider.requiresToaCorrection) provider.performToa(band)
    return band

  } catch (err) {
    throw err
  }

}
