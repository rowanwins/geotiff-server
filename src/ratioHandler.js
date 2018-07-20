const geoblaze = require('geoblaze')

export function performBandArithmatic (ratio) {
  // ratio in as argument
  const ndvi = geoblaze.bandArithmetic('georaster', '(b3-b2)/(b3+b2)')
  return ndvi
}
