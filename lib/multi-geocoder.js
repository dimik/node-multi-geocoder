var Vow = require('Vow'),
    inherit = require('inherit');

module.exports = inherit(/** @lends Geocoder.prototype */ {
    __constructor: function (options) {
        this._options = options || {};
        this.setProvider(this._options.provider || 'yandex');
    },
    getProvider: function () {
        return this._provider;
    },
    setProvider: function (key) {
        var GeocodeProvider = require('./providers/' + key + '/geocode-provider');

        this._provider = new GeocodeProvider(this._options);

        return this;
    },
    geocode: function (points) {
        var provider = this._provider;

        return Vow.allResolved(
            points
                .slice(0, 10)
                .map(function (point) {
                    return provider.geocode.bind(provider, point);
                })
                .reduce(function (promises, handler, index) {
                    promises.push(
                        promises[index].then(handler)
                    );

                    return promises;
                }, [ Vow.resolve() ])
        )
        .then(function (res) {
            return {
                "type": "FeatureCollection",
                "features": res.slice(1).map(function (p) { return p.valueOf(); })
            };
        });
    }
});
