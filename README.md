## geotiff-server
A node.js server that generate tiles from cloud-optimised geotiff's.

## The general idea
- A simple slippy-map tile server based on [express.js](https://expressjs.com/)
- Configurable 'providers' to handle interactions with datastores such as the [landsat on AWS](https://landsatonaws.com/)

## Sample endpoint
````
http://localhost:5000/tiles/7320/4375/13?sceneId=LC80990692014143LGN00&rgbBands=b2,b1
````

## Why?
- Existing solutions are fiddly to get up and running and have lots of dependencies.

## Wishlist
- Incoporate geoblaze to allow raster calculations (eg NDVI) 