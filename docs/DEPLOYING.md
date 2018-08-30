## How to deploy

1. Clone this repo
2. Configure your providers in `src/providers`
  - See PROVIDERS.md
3. Configure your colour ramps in `src/symbology`
4. Run `npm run build`
5. Run `sls deploy` to deploy your tile server using serverless
  - this is currently configured to run in AWS Lamdba in US-West-2 as that's next to the landsat public dataset, however if your setting up your own provider and COGs are stored somewhere else in the world you may want to adjust the location of your lambda.
6. Consume you're tiles
````
// A simple example as a leaflet tile layer
L.tileLayer('https://abcdsdfds.execute-api.us-west-2.amazonaws.com/production/tiles/calculate/{x}/{y}/{z}.jpg?{params}', {
  params: 'sceneId=LC80990692014143LGN00',
  maxZoom: 16
}).addTo(mymap)
````
