var tilebelt = require('tilebelt')
const PNG = require('pngjs').PNG

export function createBbox (x, y, z) {
  return tilebelt.tileToBBOX([x, y, z])
}

export function createRgbTile (rData, gData, bData) {

  const tileHeight = 254
  const tileWidth = 254

  var newfile = new PNG({
    width: tileWidth,
    height: tileHeight,
    colorType: 6
  })

  for (var y = 0; y < newfile.height; y++) {
    for (var x = 0; x < newfile.width; x++) {
      var idx = (newfile.width * y + x) << 2
      // if(y===0)console.log(scaleVal(rData[idx]), scaleVal(gData[idx]), scaleVal(bData[idx]))
      newfile.data[idx] = scaleVal(rData[idx])
      newfile.data[idx + 1] = scaleVal(gData[idx])
      newfile.data[idx + 2] = scaleVal(bData[idx])
      newfile.data[idx + 3] = 255
    }
  }

  var buffer = PNG.sync.write(newfile)
  return buffer
}

function scaleVal (val) {
  return (val / 65535) * 255
}
