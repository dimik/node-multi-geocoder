node-multi-geocoder
===================
NodeJS module for geocoding of address list.

Getting Started
---------------
You can install this module using Node Package Manager (npm):

    npm install multi-geocoder

Usage
-----
The "geocode" method accepts address array and returns [Promises/A+](http://promisesaplus.com/) instance that will be fulfilled with [GeoJSON FeaturesCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)
You can choose geocode provider or coordinates order with the appropriate option.
The following providers are available: "yandex" (default), "google".

```js
var MultiGeocoder = require('multi-geocoder'),
    geocoder = new MultiGeocoder({ provider: 'yandex', coordorder: 'latlong' });

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
