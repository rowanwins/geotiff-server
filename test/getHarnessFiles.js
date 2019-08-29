const wget = require('node-wget')

const bands = ['B2', 'B3', 'B4', 'B5', 'MTL']

const baseURL = 'http://landsat-pds.s3.amazonaws.com/L8/099/069/LC80990692014143LGN00/LC80990692014143LGN00_'
const file = 'LC80990692014143LGN00_'

console.log(`Starting image retrieval - this'll take a few mins`)

bands.map((band) => {
  const ext = band[0] === 'B' ? '.TIF' : '.json'
  wget({
    url: `${baseURL}${band}${ext}`,
    dest: __dirname + '/harness/' //eslint-disable-line
  },
  function (error, response, body) {
    if (error) {
      console.log(error)
    } else {
      console.log(`Retrieved ${file}${band}${ext}`)
    }
  })
})
