// Taken from https://stackoverflow.com/a/14438954
export function getUniqueValues (arr) {
  function onlyUnique (value, index, self) {
    return self.indexOf(value) === index
  }
  return arr.filter(onlyUnique)
}

export function findUniqueBandShortNamesInString (string) {
  var regExpressionTester = /(b)\d+/g
  return getUniqueValues(regExpressionTester.exec(string))
}

export function latLonToUtm (coords, zone) {
  const lat = coords[1]
  const lon = coords[0]

  if (!(-80 <= lat && lat <= 84)) throw new Error('Outside UTM limits') //eslint-disable-line

  const falseEasting = 500e3
  const falseNorthing = 10000e3

  var λ0 = ((zone - 1) * 6 - 180 + 3).toRadians() // longitude of central meridian

  // grid zones are 8° tall; 0°N is offset 10 into latitude bands array
  var mgrsLatBands = 'CDEFGHJKLMNPQRSTUVWXX' // X is repeated for 80-84°N
  var latBand = mgrsLatBands.charAt(Math.floor(lat / 8 + 10))
  // adjust zone & central meridian for Norway
  if (zone === 31 && latBand === 'V' && lon >= 3) { zone++; λ0 += (6).toRadians() }
  // adjust zone & central meridian for Svalbard
  if (zone === 32 && latBand === 'X' && lon < 9) { zone--; λ0 -= (6).toRadians() }
  if (zone === 32 && latBand === 'X' && lon >= 9) { zone++; λ0 += (6).toRadians() }
  if (zone === 34 && latBand === 'X' && lon < 21) { zone--; λ0 -= (6).toRadians() }
  if (zone === 34 && latBand === 'X' && lon >= 21) { zone++; λ0 += (6).toRadians() }
  if (zone === 36 && latBand === 'X' && lon < 33) { zone--; λ0 -= (6).toRadians() }
  if (zone === 36 && latBand === 'X' && lon >= 33) { zone++; λ0 += (6).toRadians() }

  var φ = lat.toRadians()
  var λ = lon.toRadians() - λ0

  const a = 6378137
  const f = 1 / 298.257223563
  // WGS 84: a = 6378137, b = 6356752.314245, f = 1/298.257223563;

  var k0 = 0.9996

  var e = Math.sqrt(f * (2 - f))
  var n = f / (2 - f)
  var n2 = n * n
  const n3 = n * n2
  const n4 = n * n3
  const n5 = n * n4
  const n6 = n * n5

  const cosλ = Math.cos(λ)
  const sinλ = Math.sin(λ)

  var τ = Math.tan(φ)
  var σ = Math.sinh(e * Math.atanh(e * τ / Math.sqrt(1 + τ * τ)))

  var τʹ = τ * Math.sqrt(1 + σ * σ) - σ * Math.sqrt(1 + τ * τ)

  var ξʹ = Math.atan2(τʹ, cosλ)
  var ηʹ = Math.asinh(sinλ / Math.sqrt(τʹ * τʹ + cosλ * cosλ))

  var A = a / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6)

  var α = [ null, // note α is one-based array (6th order Krüger expressions)
    1 / 2 * n - 2 / 3 * n2 + 5 / 16 * n3 + 41 / 180 * n4 - 127 / 288 * n5 + 7891 / 37800 * n6,
    13 / 48 * n2 - 3 / 5 * n3 + 557 / 1440 * n4 + 281 / 630 * n5 - 1983433 / 1935360 * n6,
    61 / 240 * n3 - 103 / 140 * n4 + 15061 / 26880 * n5 + 167603 / 181440 * n6,
    9561 / 161280 * n4 - 179 / 168 * n5 + 6601661 / 7257600 * n6,
    34729 / 80640 * n5 - 3418889 / 1995840 * n6,
    212378941 / 319334400 * n6 ]

  var ξ = ξʹ
  var j = 1
  for (j; j <= 6; j++) ξ += α[j] * Math.sin(2 * j * ξʹ) * Math.cosh(2 * j * ηʹ)

  var η = ηʹ
  for (j = 1; j <= 6; j++) η += α[j] * Math.cos(2 * j * ξʹ) * Math.sinh(2 * j * ηʹ)

  var x = k0 * A * η
  var y = k0 * A * ξ

  x = x + falseEasting
  if (y < 0) y = y + falseNorthing

  return [x, y]
};
