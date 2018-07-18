const geoblaze = require('geoblaze')

export function performBandArithmatic (ratio) {

  //ratio in as argument
  const ndvi = geoblaze.bandArithmetic(georaster, '(c - b)/(c + b)');

}