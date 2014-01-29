function GoogleGeocoderView(data) {
    this._data = data;
}

GoogleGeocoderView.prototype.toJSON = function (options) {
    var geoObject = this._data.results[0];

    if(!geoObject) {
        return;
    }

    options = options || {};

    var lowerCorner = [
            geoObject.geometry.viewport.southwest.lng,
            geoObject.geometry.viewport.southwest.lat
        ],
        upperCorner = [
            geoObject.geometry.viewport.northeast.lng,
            geoObject.geometry.viewport.northeast.lat
        ],
        coordinates = [
            geoObject.geometry.location.lng,
            geoObject.geometry.location.lat
        ];

    if(options.coordorder === 'latlong') {
        [lowerCorner, upperCorner, coordinates].forEach(function (c) {
            c.reverse();
        });
    }

    return {
        "type": "Feature",
        "bbox": [lowerCorner, upperCorner],
        "geometry": {
            "type": "Point",
            "coordinates": coordinates,
        },
        "properties": {
            "address_components": geoObject.address_components,
            "formatted_address": geoObject.formatted_address,
            "types": geoObject.types
        }
    };
};

module.exports = GoogleGeocoderView;
