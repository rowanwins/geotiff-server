var tilebelt = require('tilebelt')
// const PNG = require('pngjs').PNG
var jpeg = require('jpeg-js')

export function createBbox (x, y, z) {
  return tilebelt.tileToBBOX([x, y, z])
}

export function createRgbTile (rData, gData, bData) {

  const tileHeight = 256
  const tileWidth = 256

  var frameData = Buffer.alloc(tileWidth * tileHeight * 4)

  for (let i = 0; i < frameData.length / 4; ++i) {
    frameData[i * 4] = scaleVal(rData[i])
    frameData[(i * 4) + 1] = scaleVal(gData[i])
    frameData[(i * 4) + 2] = scaleVal(bData[i])
    frameData[(i * 4) + 3] = 0
  }

  var rawImageData = {
    data: frameData,
    width: tileWidth,
    height: tileHeight
  }
  var jpegImageData = jpeg.encode(rawImageData)
  return jpegImageData
}

function scaleVal (val) {
  return Math.round((val / 65535) * 255)
}
