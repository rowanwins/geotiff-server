## Providers
A provider is a datastore where COG's are found, for example the landsat public dataset on AWS.

Geotiff-Server is designed to be flexible to allow you to add additional providers.

A provider is a basic object that provides a few details about the datasource such as what bands it has, how to find a scene, whether it requires reprojecting etc

### Adding a new provider
- To create a new provider copy and paste the `providers/LandsatPDSProvider.js` file and modify it accordingly. 
- You'll then also need to add it to the `providerList` in `provideres/index.js`