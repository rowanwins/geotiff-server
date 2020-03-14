## geotiff-server
A node.js server that generate tiles from cloud-optimised geotiff's designed for use with a serverless function provider like AWS Lambda.

## The general idea
- A simple slippy-map tile server based on NodeJS and [express.js](https://expressjs.com/)
- Configurable 'providers' to handle interactions with datastores such as the [landsat on AWS](https://landsatonaws.com/)
- An endpoint for rgb tiles allowing different band combinations
- An endpoint for calculated indices such as NDVI
- An endpoint for getting metadata

## RGB endpoint

| Param         | Description   | Mandatory  |
| ------------- |:-------------:| ----------:|
| sceneID       | A unique id for a geotiff in a datastore | true       |
| provider      | A name of a datastore to search      | false (defaults to landsat-pds on AWS)  |
| rgbBands      | Which bands to use as the RGB | false |
| pMin          | The lower percentile value to clip values to (can be retrieved via the metadata endpoint) | false |
| pMax          | The upper percentile value to clip values to (can be retrieved via the metadata endpoint) | false |


#### Example
````
http://localhost:5000/tiles/1829/1100/11.jpeg?
    sceneId=LC80990692014143LGN00


// A more complicated example
http://localhost:5000/tiles/{x}/{y}/{z}.jpeg?
    sceneId=S2A_OPER_MSI_ARD_TL_EPAE_20190828T022125_A021835_T54KWC_N02.08
    &provider=DEA
    &pMin=630
    &pMax=2646 
````

## Calculated endpoint

| Param         | Description   | Mandatory  |
| ------------- |:-------------:| ----------:|
| sceneID       | A unique id for a geotiff in a datastore | true       |
| provider      | A name of a datastore to search      | false (defaults to landsat-pds on AWS)  |
| ratio         | A band calculation to apply (eg `(b3-b5)/(b3+b5)`) | true |
| style         | A style to use for colouring the image (valid options currently are 'NDWI', 'NDVI') | false |

#### Example
````
http://localhost:5000/tiles/calculate/1829/1100/11.jpeg?
   sceneId=LC80990692014143LGN00
   &ratio=(b3-b5)/(b3+b5)  <---- although ensure the ratio is urlEncoded
   &style=NDWI
````


## Metadata endpoint

| Param         | Description   | Mandatory  |
| ------------- |:-------------:| ----------:|
| sceneID       | A unique id for a geotiff in a datastore | true       |
| provider      | A name of a datastore to search | false (defaults to landsat-pds on AWS)  |
| bands         | A comma seperated lists of bands to retrieve information for | false |

#### Example
````
http://localhost:5000/metadata?
   sceneId=S2A_OPER_MSI_ARD_TL_EPAE_20190828T022125_A021835_T54KWC_N02.08
   &provider=DEA
   &bands=b1,b2

=> [
    {
        "bandName": "b1",
        "stats": {
            "percentiles": [584,1058],
            "min": 327,
            "max": 1517,
            "stdDeviation": 115.71190214142455
        }
    },
    {
        "bandName": "b2",
        "stats": {
            "percentiles": [630, 1320],
            "min": 265,
            "max": 3348,
            "stdDeviation": 163.80461720104134
        }
    }
]

````

## Why?
- Cloud Optimised GeoTIFFs are awesome and I wanted to learn more about them.

## Haven't you heard of rio-tiler/landsat-tiler?
- Yep it's very awesome, it's what inspired this project
- The downsides I ran into were 
  - it requires Docker (which doesn't work very nicely on Windows)
  - It relies on rasterio, which relies on GDAL, and consequently the build was very large (hence why it's using the docker setup to try and streamline some of the build processes)

## Roadmap

- More colour ramps and investigate sending styles to chromajs from the client side
- Investigate symbolising by classes for the `calculate` endpoint (eg -1 to -0.5, -0.5 to 0, 0 to 0.5, 0.5 to 1)
- Implement error handling
- Switch to png's instead of jpgs to allow transparency
