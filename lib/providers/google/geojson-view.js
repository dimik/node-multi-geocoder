var inherit = require('inherit');
var JSPath = require('jspath');
var _ = require('lodash');

module.exports = inherit(/** @lends GoogleGeoJSONView.prototype */ {
    __constructor: function (data, options) {
        this._data = data;
        this._options = options || {};
    },
    toJSON: function () {
        return this._data;
    },
    toGeoJSON: function () {
        try{
        console.log(this._data);
        var geoObject = JSPath.apply('.results[0]', this._data)[0];
        } catch(e) {
            console.log(e);
        }

        if(!geoObject) {
            throw new Error('not found');
        }

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

        if(this._options.coordorder === 'latlong') {
            [lowerCorner, upperCorner, coordinates].forEach(function (c) {
                c.reverse();
            });
        }

        return {
            "id": _.uniqueId(),
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
    }
});
