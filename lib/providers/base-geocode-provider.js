var vow = require('vow'),
    inherit = require('inherit'),
    HTTPClient = require('handy-http'),
    client = new HTTPClient(),
    extend = function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    };

module.exports = inherit(/** @lends GeocoderProvider.prototype */ {

    __constructor: function (options) {
        this._options = extend({}, options);
    },

    geocode: function (point, options) {
        var defer = vow.defer();

        client.open({
            url: this.getRequestUrl(),
            method: 'GET',
            data: extend({}, this.getRequestParams(point), options),
            headers: this.getRequestHeaders()
        }, function (err, res) {
            if(err) {
                defer.reject(err);
            }
            else {
                defer.resolve(this.process(res));
            }
        }.bind(this));

        return defer.promise().delay(~~this._options.timeout);
    },

    process: function (result) {
        return result;
    },

    getRequestHeaders: function () {
        return {
            "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Charset" : "windows-1251,utf-8;q=0.7,*;q=0.3",
            "Accept-Language" : "ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4",
            "Connection" : "keep-alive",
            "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.1634 Safari/535.19 YI"
        };
    },

    getRequestUrl: function () {
        return '';
    },

    getRequestParams: function (point) {
        return {};
    },

    getText: function (point) {
        return point;
    }

});
