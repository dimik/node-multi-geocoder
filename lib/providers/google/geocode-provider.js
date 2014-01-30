var BaseGeocodeProvider = require('../base-geocode-provider'),
    GeoJSONView = require('./geojson-view'),
    inherit = require('inherit');

module.exports = inherit(BaseGeocodeProvider, {
    __constructor: function (options) {
        this.__base.apply(this, arguments);
    },
    process: function (result) {
        return (new GeoJSONView(result)).toJSON(this._options);
    },
    getRequestParams: function (point) {
        return {
            address: this.getText(point),
            sensor: false
        };
    },
    getRequestUrl: function () {
        return 'http://maps.googleapis.com/maps/api/geocode/json';
    }
});
