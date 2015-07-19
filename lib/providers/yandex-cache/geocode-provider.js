var YandexGeocodeProvider = require('../yandex/geocode-provider'),
    _ = require('lodash'),
    vow = require('vow'),
    inherit = require('inherit'),
    LRU = require('lru-cache'),
    cache = LRU({
        max: 25000,
        // Cache for a month as default
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

module.exports = inherit(YandexGeocodeProvider, {
    geocode: function (point, options) {
        var cacheKey = this.createCacheKey(point, options);

        if(cache.has(cacheKey)) {
            this.onLoadFromCache(cacheKey, cache.peek(cacheKey));
            return vow.resolve(cache.get(cacheKey));
        }

        return this.__base.apply(this, arguments)
            .then(function (res) {
                cache.set(cacheKey, res);

                return res;
            });
    },
    createCacheKey: function (point, options) {
        var params = _.extend({}, this.getRequestParams(point), options);

        return Object.keys(params).reduce(function (cacheKey, param) {
            return [cacheKey, param, params[param]].join('~');
        }, '').substring(1);
    },
    clear: function () {
        cache.reset();
    },
    /**
     * Could be overridden for cache hit counting.
     */
    onLoadFromCache: function (cacheKey, value) {
    }
});
