import GeoTIFF from 'geotiff/dist/geotiff.bundle.js'

export async function getScene (band, bbox, provider) {
  try {

    const tiff = await GeoTIFF.fromUrl(band.urlPath)
    const data = await tiff.readRasters({
      bbox: bbox,
      width: 256,
      height: 256
    })
    band.data = data[0]
    if (provider.requiresToaCorrection) provider.performToa(band)
    return band

  } catch (err) {
    throw err
  }

}
