node-multi-geocoder
===================
NodeJS module for geocoding of address list.

Getting Started
---------------
You can install this module using Node Package Manager (npm):

    npm install multi-geocoder

Usage
-----
The "geocode" method accepts address array and returns [Promises/A+](http://promisesaplus.com/) instance that will be fulfilled with object that has "result" field – [GeoJSON FeaturesCollection](http://geojson.org/geojson-spec.html#feature-collection-objects).
And "errors" field contains the array of requests could not be geocoded.
You can choose geocode provider or coordinates order with the appropriate option.
The following providers are available: "yandex-cache" (default), "yandex", "google".

```js
var MultiGeocoder = require('multi-geocoder'),
    geocoder = new MultiGeocoder({ provider: 'yandex-cache', coordorder: 'latlong' });

geocoder.geocode(['Moscow', 'New York', 'Paris', 'London'])
    .then(function (res) {
        console.log(res);
    });
```

If you have an array of objects with "address" property
or addresses on a deeper level
you should overlap the "getText" method of geocode provider as follows:

```js
var MultiGeocoder = require('multi-geocoder'),
    geocoder = new MultiGeocoder({ provider: 'yandex', coordorder: 'latlong' }),
    provider = geocoder.getProvider();

provider.getText = function (point) {
    return point.address;
};

geocoder.geocode([{ address: 'Moscow' }, { address: 'New York' }, { address: 'Paris' }, { address: 'London' }])
    .then(function (res) {
        console.log(res);
    });
```

To use [Yandex API Geocode Key](https://tech.yandex.ru/maps/keys/)
you should overlap the "getRequestParams" method of geocode provider as follows:

```js
var MultiGeocoder = require('multi-geocoder'),
    geocoder = new MultiGeocoder({ provider: 'yandex', coordorder: 'latlong' }),
    provider = geocoder.getProvider();

var getRequestParams = provider.getRequestParams;
provider.getRequestParams = function () {
  var result = getRequestParams.apply(provider, arguments);
  result.key = '_my_api_key_';
  return result;
};
geocoder.geocode(['Moscow', 'New York', 'Paris', 'London'])
    .then(function (res) {
        console.log(res);
    });
```
