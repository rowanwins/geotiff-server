import chroma from 'chroma-js'

export function getRampByName (name) {
  if (name === 'NDWI') return createNdwi()
}

export function getRgbFromRamp (colorRamp, value) {
  var rgb = colorRamp(value)
  return [rgb._rgb[0], rgb._rgb[1], rgb._rgb[2]]
}

function createNdwi () {
  return chroma.scale(['green', 'white', 'blue']).domain([-1, 1])
}
