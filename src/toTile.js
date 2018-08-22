var tilebelt = require('tilebelt')
// const PNG = require('pngjs').PNG
var jpeg = require('jpeg-js')
var Parser = require('expr-eval').Parser

export function createBbox (x, y, z) {
  return tilebelt.tileToBBOX([x, y, z])
}

export function createRgbTile (rData, gData, bData, meta) {

  const tileHeight = 256
  const tileWidth = 256
  toaReflectance(rData.data, meta, 4)
  toaReflectance(gData.data, meta, 3)
  toaReflectance(bData.data, meta, 2)

  var frameData = Buffer.alloc(tileWidth * tileHeight * 4)

  for (let i = 0; i < frameData.length / 4; ++i) {
    frameData[i * 4] = rData[i]
    frameData[(i * 4) + 1] = gData[i]
    frameData[(i * 4) + 2] = bData[i]
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

export function createSingleBandTile (data, expression, bandsInExpression) {
  const tileHeight = 256
  const tileWidth = 256
  var frameData = Buffer.alloc(tileWidth * tileHeight)

  var parser = new Parser()
  var expr = parser.parse(expression)

  for (let i = 0; i < frameData.length; i++) {
    const args = {}
    for (var ii = 0; i < bandsInExpression.length; ii++) {
      args[bandsInExpression[ii]] = bandsInExpression[ii][i]
    }
    frameData[i] = expr.evaluate(args)
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

function toaReflectance (data, metadata, bandNumber) {
  const sunElevation = metadata.L1_METADATA_FILE.IMAGE_ATTRIBUTES.SUN_ELEVATION
  const se = Math.sin(degressToRadians(sunElevation))
  const reflectanceRescalingFactor = metadata.L1_METADATA_FILE.RADIOMETRIC_RESCALING[`REFLECTANCE_MULT_BAND_${bandNumber}`]
  const reflectanceAddition = metadata.L1_METADATA_FILE.RADIOMETRIC_RESCALING[`REFLECTANCE_ADD_BAND_${bandNumber}`]

  for (var i = 0; i < data.length; i++) {
    data[i] = (((reflectanceRescalingFactor * data[i]) + reflectanceAddition) / se) * 1000
  }
}

function degressToRadians (degrees) {
  return degrees * Math.PI / 180
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
