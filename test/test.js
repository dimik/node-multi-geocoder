var MultiGeocoder = require('..');

exports.testInstanceProperties = function (test) {
    var geocoder = new MultiGeocoder();

    test.equal(typeof geocoder.geocode, 'function');
    test.equal(typeof geocoder.getProvider, 'function');
    test.equal(typeof geocoder.setProvider, 'function');
    test.equal(typeof geocoder.geocode(['Москва']).then, 'function');

    test.done();
};

exports.testAddressList = function (test) {
    var geocoder = new MultiGeocoder();

    test.expect(3);

    geocoder.geocode(['Москва', 'Лондон', 'Париж'])
        .then(function (res) {
            test.equal(typeof res, 'object');
            test.ok(res.features.length === 3);
            test.ok(res.features[0].properties.name === 'Москва');
            test.done();
        })
        .fail(function (err) {
            test.ifError(err);
        });
};

exports.testAddressObjectsList = function (test) {
    var geocoder = new MultiGeocoder();

    geocoder.getProvider().getText = function (point) {
        return point.address;
    };

    test.expect(3);

    geocoder.geocode([{ address: 'Москва' }, { address: 'Лондон' }, { address: 'Париж' }])
        .then(function (res) {
            test.equal(typeof res, 'object');
            test.ok(res.features.length === 3);
            test.ok(res.features[0].properties.name === 'Москва');
            test.done();
        })
        .fail(function (err) {
            test.ifError(err);
        });
};
