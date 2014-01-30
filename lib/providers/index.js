module.exports = [
    'yandex',
    'google'
].reduce(function (exports, provider) {
    exports[provider] = require('./' + provider + '/geocode-provider');

    return exports;
}, {});
