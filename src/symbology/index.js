import chroma from 'chroma-js'

export function getRampByName (name, numClasses) {
  if (name === 'NDWI') return createNdwi(numClasses)
  if (name === 'NDVI') return createNdvi(numClasses)
}

export function getRgbFromRamp (colorRamp, value) {
  if (value < colorRamp.minValue) return colorRamp.minRgb
  var rgb = colorRamp.scale(value)
  return [rgb._rgb[0], rgb._rgb[1], rgb._rgb[2], 0]
}

function createNdwi (numClasses) {
  if (numClasses === null) return createRegularRamp(0, null, ['green', 'white', 'blue'], [-1, 1])
  return createClassRamp(-1, null, ['green', 'white', 'blue'], [-1, 1], numClasses)
}

function createNdvi (numClasses) {
  if (numClasses === null) return createRegularRamp(0, null, ['lightyellow', 'darkgreen'], [0, 1])
  return createClassRamp(0, null, ['green', 'white', 'blue'], [-1, 1], numClasses)
}

function createRegularRamp (minValue, minRgb, colorsArr, domainArr) {
  if (minRgb === null) minRgb = [191, 191, 191, 0]
  return {
    minValue: minValue,
    minRgb: minRgb,
    scale: chroma.scale(colorsArr).mode('lab').domain(domainArr)
  }
}

function createClassRamp (minValue, minRgb, colorsArr, domainArr, numClasses) {
  if (minRgb === null) minRgb = [191, 191, 191, 0]
  return {
    minValue: minValue,
    minRgb: minRgb,
    scale: chroma.scale(colorsArr).domain(domainArr).classes(numClasses)
  }
}
