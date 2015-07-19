module.exports = [
    'yandex',
    'yandex-cache',
    'google'
].reduce(function (exports, provider) {
    exports[provider] = require('./' + provider + '/geocode-provider');

    return exports;
}, {});
