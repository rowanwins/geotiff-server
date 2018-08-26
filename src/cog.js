var GeoTIFF = require('geotiff')

export async function getScene (band, bbox, provider) {
  const tiff = await GeoTIFF.fromUrl(band.urlPath)
  const data = await tiff.readRasters({
    bbox: bbox,
    width: 256,
    height: 256
  })

  band.data = data[0]
  if (provider.requiresToaCorrection) provider.performToa(band)
  return band
}
