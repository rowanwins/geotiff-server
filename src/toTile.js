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
  var jpegImageData = jpeg.encode(rawImageData, 100)
  return jpegImageData
}

function scaleVal (val) {
  return Math.round((val / 65535) * 255)
}

function sigmoidalContrast (data, contrast, bias) {
  const alpha = bias
  const beta = contrast

  if (beta > 0) {
    const denominator = 255 / (255 + Math.exp(beta * (alpha - 255))) - 255 / (255 + Math.exp(beta * alpha))
    for (let i = 0; i < data.length; i++) {
      const numerator = 255 / (255 + Math.exp(beta * (alpha - data[i]))) - 255 / (255 + Math.exp(beta * alpha))
      data[i] = numerator / denominator
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      data[i] = (
        (beta * alpha) - Math.log(
          (
            255 / (
              (data[i] / (255 + Math.exp((beta * alpha) - beta))) -
              (data[i] / (255 + Math.exp(beta * alpha))) +
              (255 / (255 + Math.exp(beta * alpha)))
            )
          ) - 255)
      ) / beta
    }
  }
  return data
}
