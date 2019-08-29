## geotiff-server
A node.js server that generate tiles from cloud-optimised geotiff's designed for use with a serverless function provider like AWS Lambda.

## The general idea
- A simple slippy-map tile server based on NodeJS and [express.js](https://expressjs.com/)
- Configurable 'providers' to handle interactions with datastores such as the [landsat on AWS](https://landsatonaws.com/)
- An endpoint for rgb tiles allowing different band combinations
- An endpoint for calculated indices such as NDVI

## RGB endpoint

| Param         | Description   | Mandatory  |
| ------------- |:-------------:| ----------:|
| sceneID       | A unique id for a geotiff in a datastore | true       |
| provider      | A name of a datastore to search      | false (defaults to landsat-pds on AWS)  |
| rgbBands      | Which bands to use as the RGB | false |

#### Example
````
http://localhost:5000/tiles/1829/1100/11.jpg?
    sceneId=LC80990692014143LGN00
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
http://localhost:5000/tiles/calculate/1829/1100/11.jpg?
   sceneId=LC80990692014143LGN00
   &ratio=(b3-b5)/(b3+b5)
   &style=NDWI
````

## Why?
- Cloud Optimised GeoTIFFs are awesome and I wanted to learn more about them.

## Haven't you heard of rio-tiler/landsat-tiler?
- Yep it's very awesome, it's what inspired this project
- The downsides I ran into were 
  - it requires Docker (which doesn't work very nicely on Windows)
  - It relies on rasterio, which relies on GDAL, and consequently the build was very large (hence why it's using the docker setup to try and streamline some of the build processes)

## Roadmap
- Investigate performance 
  - Currently going a bit slower than landsat-tiler according to the cloudwatch logs
- More colour ramps and investigate sending styles to chromajs from the client side
- Investigate symbolising by classes for the `calculate` endpoint (eg -1 to -0.5, -0.5 to 0, 0 to 0.5, 0.5 to 1)
- Implement error handling
- Switch to png's instead of jpgs to allow transparency
- Configure a few more sample providers such as Digital Earth Australia