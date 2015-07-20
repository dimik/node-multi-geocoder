var BaseGeocodeProvider = require('../base-geocode-provider'),
    GeoJSONView = require('./geojson-view'),
    inherit = require('inherit');

module.exports = inherit(BaseGeocodeProvider, {
    __constructor: function (options) {
        this.__base.apply(this, arguments);
    },
    process: function (result) {
        var view = new GeoJSONView(result, this._options);

        return view.toGeoJSON();
    },
    getRequestParams: function (point) {
        var options = this._options;
        var result = {
            geocode: this.getText(point),
            format: 'json',
            results: '1'
        };

        if(options.sco === 'latlong' || options.coordorder === 'latlong') {
            result.sco = 'latlong';
        }

        return result;
    },
    getRequestUrl: function () {
        return 'https://geocode-maps.yandex.ru/1.x/';
    }
});
