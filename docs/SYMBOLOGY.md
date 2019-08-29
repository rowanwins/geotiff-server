## Symbology
We aim to provide a flexible framework for symbology although we're still in our early days of implementation.

We're using [chromajs](http://gka.github.io/chroma.js) for 

### RGB
- The rgb tiles endpoint does not accept a style parameter

### Calculate endpoint
Below are details on a number of parameters related to styling.

#### Style
The `style` param accepts either a string of a prefined style, such as 'NDWI' or 'NDVI'. Alternatively you can set the style parameter to 'custom'. If you do this read the custom section below.

#### Classes
The `classes` param can be used to specify the number of classes to break your ramp into. 
- If you pass a number the scale will broken into equi-distant classes (eg `classes=5`)
- Alternatively you can also define custom class breaks by passing them as array (eg `classes=0,0.3,0.55,0.85,1`)

### Custom Styles
- `customColors` an array of colors or a valid chromajs color scale name. Defaults to `spectral`
- `customDomain` an array of values to use as a [domain](http://gka.github.io/chroma.js/#scale-domain) for the chromajs color scale. Defaults to `0,1`
`customClasses` see documenation above re classes 
