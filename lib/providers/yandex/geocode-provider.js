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
            geocode: this.getText(point),
            format: 'json',
            results: '1'
        };
    },
    getRequestUrl: function () {
        return 'http://geocode-maps.yandex.ru/1.x/';
    }
});
