var inherit = require('inherit');
var JSPath = require('jspath');
var _ = require('lodash');

module.exports = inherit(/** @lends YandexGeoJSONView.prototype */ {
    __constructor: function (data, options) {
        this._data = data;
        this._options = options || {};
    },
    toJSON: function () {
        return this._data;
    },
    toGeoJSON: function () {
        var geoObject = JSPath.apply('.response.GeoObjectCollection.featureMember[0].GeoObject', this._data)[0];

        if(!geoObject) {
            throw new Error('GeoObject Not Found');
        }

        var lowerCorner = geoObject.boundedBy.Envelope.lowerCorner.split(' ').map(Number),
            upperCorner = geoObject.boundedBy.Envelope.upperCorner.split(' ').map(Number),
            coordinates = geoObject.Point.pos.split(' ').map(Number);

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
                "name": geoObject.name,
                "description": geoObject.description,
                "metaDataProperty": geoObject.metaDataProperty
            }
        };
    }
});
