#!/usr/bin/env node

var fs = require('fs'),
    util = require('util'),
    MultiGeocoder = require('..'),
    geocoder = new MultiGeocoder({ provider: 'yandex' }),
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

// Перекравываем метод получения адреса у экземпляра провайдера.
geocoder.getProvider().getText = function (point) {
    var text = 'Москва, ' + point.address;

    console.log(text);
    return text;
};

fs.readFile('./source.json', function (err, data) {
    if(err) throw err;

    data = JSON.parse(data.toString());

    geocoder.geocode(data)
        .then(function (res) {
            // Если нам нужно расширить полученными данными исходный JSON,
            // делаем это подобным образом
            /*
            res.features.forEach(function (geoObject, index) {
                if(geoObject) {
                    var source = data[index];

                    extend(geoObject.properties, data[index]);
                }
            });
            */
            fs.writeFile('./geocoded.json', JSON.stringify(res));
            console.log('geocoded: %s', res.features.length);
        })
        .fail(function (err) {
            console.log('error', err);
        });
});
