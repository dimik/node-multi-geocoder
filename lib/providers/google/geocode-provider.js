var BaseGeocodeProvider = require('../base-geocode-provider'),
    GeoJSONView = require('./geojson-view'),
    inherit = require('inherit');

module.exports = inherit(BaseGeocodeProvider, {
    __constructor: function (options) {
        this.__base.apply(this, arguments);
    },
    /*
    geocode: function () {
        return this.__base.apply(this, arguments).delay(5000);
    },
    */
    process: function (result) {
        var view = new GeoJSONView(result, this._options);

        return view.toGeoJSON();
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
