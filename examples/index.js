var fs = require('fs'),
    MultiGeocoder = require('..'),
    geocoder = new MultiGeocoder({ provider: 'yandex-cache' }),
    provider = geocoder.getProvider();

// Перекравываем метод получения адреса у экземпляра провайдера.
provider.getText = function (point) {
    var text = 'Москва, ' + point.address;

    return text;
};

/**
 * Использование ключа для АПИ Яндекса
 * @see https://tech.yandex.ru/maps/keys/
 *
var getRequestParams = provider.getRequestParams;
provider.getRequestParams = function () {
  var result = getRequestParams.apply(provider, arguments);
  result.key = '_my_api_key_';
  return result;
};
 */

fs.readFile('./source.json', function (err, data) {
    if(err) throw err;

    data = JSON.parse(data.toString());

    geocoder.geocode(data)
        .then(function (data) {
            var result = data.result, errors = data.errors;

            fs.writeFile('./geocoded.json', JSON.stringify(result));
            console.log('geocoded: %s', result.features.length);
            console.log('errors: %j', errors);
        })
        .progress(function (progress) {
            console.log(progress.message);
        })
        .fail(function (err) {
            console.log('error', err);
        });
});
