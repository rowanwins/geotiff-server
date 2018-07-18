// const { createCanvas } = require('canvas')
var tilebelt = require('tilebelt');

export function xyzToBbox (x, y, z) {
    return tilebelt.tileToBBOX([x,y,z])
}

export function createRgbTile () {
    const tileHeight = 512
    const tileWidth = 512
    const canvas = createCanvas(tileWidth, tileHeight)
    const ctx = canvas.getContext('2d')

    color = "rgb(" + values[0] + "," + values[1] + "," + values[2] + ")";

    return canvas.toBuffer('image/png', {compressionLevel: 3, filters: canvas.PNG_FILTER_NONE})
 }

export function createSingleBandTile () {
    const tileHeight = 512
    const tileWidth = 512
    const canvas = createCanvas(tileWidth, tileHeight)
    const ctx = canvas.getContext('2d')

    return canvas.toDataURL()
 }