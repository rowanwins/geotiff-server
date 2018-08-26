import { getRampByName, getRgbFromRamp } from './symbology'

// const PNG = require('pngjs').PNG
const tilebelt = require('tilebelt')
var jpeg = require('jpeg-js')
var Parser = require('expr-eval').Parser

const tileHeight = 256
const tileWidth = 256
const frameData = Buffer.alloc(tileWidth * tileHeight * 4)

export function createBbox (x, y, z) {
  return tilebelt.tileToBBOX([x, y, z])
}

export function createRgbTile (rData, gData, bData) {

  for (let i = 0; i < frameData.length / 4; i++) {
    frameData[i * 4] = rData[i]
    frameData[(i * 4) + 1] = gData[i]
    frameData[(i * 4) + 2] = bData[i]
    frameData[(i * 4) + 3] = 0
  }

  return encodeImageData(frameData)
}

export function createSingleBandTile (bands, expression, styleName) {

  var parser = new Parser()
  var expr = parser.parse(expression)
  const colorRamp = getRampByName(styleName)

  for (let i = 0; i < frameData.length / 4; i++) {
    const args = {}
    for (var ii = 0; ii < bands.length; ii++) {
      args[bands[ii].shortName] = bands[ii].data[i]
    }

    var calculatedVal = expr.evaluate(args)
    const rgb = getRgbFromRamp(colorRamp, calculatedVal)

    frameData[i * 4] = rgb[0]
    frameData[(i * 4) + 1] = rgb[1]
    frameData[(i * 4) + 2] = rgb[2]
    frameData[(i * 4) + 3] = 0
  }

  return encodeImageData(frameData)
}

function encodeImageData (data) {
  return jpeg.encode({
    data: data,
    width: tileWidth,
    height: tileHeight
  }, 100)
}