import { getRgbFromRamp } from './symbology'
import { rescaleValueTo256 } from './utils'

import tilebelt from 'tilebelt'
import jpeg from 'jpeg-js'
import expr from 'expr-eval'
const Parser = expr.Parser

const tileHeight = 256
const tileWidth = 256

const frameData = Buffer.alloc(tileWidth * tileHeight * 4)

export function createBbox (x, y, z) {
  return tilebelt.tileToBBOX([x, y, z])
}

export function createRgbTile (rData, gData, bData, percentiles) {
  for (let i = 0; i < frameData.length / 4; i++) {
    frameData[i * 4] = rescaleValueTo256(rData[i], percentiles)
    frameData[(i * 4) + 1] = rescaleValueTo256(gData[i], percentiles)
    frameData[(i * 4) + 2] = rescaleValueTo256(bData[i], percentiles)
    frameData[(i * 4) + 3] = 0
  }
  return encodeImageData(frameData)
}

export function createSingleBandTile (bands, expression, colorRamp) {
  var parser = new Parser()
  var expr = parser.parse(expression)
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
    frameData[(i * 4) + 3] = rgb[3]
  }

  return encodeImageData(frameData)
}

function encodeImageData (data) {
  return jpeg.encode({
    data: data,
    width: tileWidth,
    height: tileHeight
  })
}
