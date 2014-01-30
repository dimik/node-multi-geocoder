var Vow = require('Vow'),
    inherit = require('inherit'),
    providers = require('./providers');

module.exports = inherit(/** @lends Geocoder.prototype */ {
    __constructor: function (options) {
        this._options = options || {};
        this.setProvider(this._options.provider || 'yandex');
    },
    getProvider: function () {
        return this._provider;
    },
    setProvider: function (key) {
        this._provider = new providers[key](this._options);

        return this;
    },
    geocode: function (points, options) {
        var provider = this._provider;

        return Vow.allResolved(
            points
                .map(function (point) {
                    return provider.geocode.bind(provider, point, options);
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
