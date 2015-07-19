var fs = require('fs'),
    util = require('util'),
    MultiGeocoder = require('..'),
    geocoder = new MultiGeocoder({ provider: 'yandex-cache' });

// Перекравываем метод получения адреса у экземпляра провайдера.
geocoder.getProvider().getText = function (point) {
    var text = 'Москва, ' + point.address;

    return text;
};

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
