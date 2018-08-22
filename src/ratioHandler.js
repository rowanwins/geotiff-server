var jpeg = require('jpeg-js')
var Parser = require('expr-eval').Parser

export function performBandArithmatic (ratio, bandData) {

  const tileHeight = 256
  const tileWidth = 256
  var frameData = Buffer.alloc(tileWidth * tileHeight)
  var parser = new Parser()
  var expr = parser.parse('(b5-b6)/(b5+b6)')

  for (let i = 0; i < frameData.length; ++i) {
    frameData[i] = expr.evaluate({ x: 3 })
  }

  var rawImageData = {
    data: frameData,
    width: tileWidth,
    height: tileHeight
  }

  var jpegImageData = jpeg.encode(rawImageData, 100)
  return jpegImageData
}
