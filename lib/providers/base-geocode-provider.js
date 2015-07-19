var vow = require('vow'),
    EventEmitter = require('events').EventEmitter,
    inherit = require('inherit'),
    HTTPClient = require('handy-http'),
    client = new HTTPClient(),
    util = require('util'),
    _ = require('lodash');

module.exports = inherit(/** @lends GeocoderProvider.prototype */ {

    __constructor: function (options) {
        this.events = new EventEmitter();
        this._options = _.extend({}, options);
    },

    geocode: function (point, options) {
        var defer = vow.defer(),
            request = {
                url: this.getRequestUrl(),
                method: 'GET',
                data: _.extend({}, this.getRequestParams(point), options),
                headers: this.getRequestHeaders()
            };

        client.open(request, function (err, res) {
            defer.notify(util.format('Processed: "%s"', this.getText(point)));
            if(err) {
                this.events.emit('requestfail', err);
                defer.reject(err);
            }
            else {
                this.events.emit('requestsuccess', res);
                defer.resolve(this.process(res));
            }
        }.bind(this));

        return defer.promise();
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
