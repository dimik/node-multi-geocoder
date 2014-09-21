'use strict';

var should = require('should');
var MultiGeocoder = require('..');

describe("MultiGeocoder", function () {
  describe("Instance", function () {
    it("should be created", function (done) {
      MultiGeocoder.should.be.a.Function;

      var geocoder = new MultiGeocoder({ provider: 'yandex' });

      geocoder.getProvider.should.be.a.Function;
      geocoder.setProvider.should.be.a.Function;
      geocoder.geocode.should.be.a.Function;
      geocoder.abort.should.be.a.Function;

      done();
    });
  });
  describe('#geocode()', function () {
    it('should return features', function (done) {
      var geocoder = new MultiGeocoder({ provider: 'yandex' });

      geocoder.geocode(['Москва', 'Лондон', 'Париж'])
        .then(function (res) {
          res.result.features.should.be.an.Array.with.lengthOf(3);
          res.result.features[0].properties.name.should.be.eql('Москва');
          res.errors.should.be.an.Array.with.lengthOf(0);
          done();
        })
        .fail(done);
    });

    it('should return features and error', function (done) {
      var geocoder = new MultiGeocoder({ provider: 'yandex' });

      geocoder.geocode(['Москва', 'абвгджз', 'Лондон', 'Париж'])
        .then(function (res) {
          res.result.features.should.be.an.Array.with.lengthOf(3);
          res.result.features[0].properties.name.should.be.eql('Москва');
          res.errors.should.be.an.Array.with.lengthOf(1);
          res.errors[0].should.have.properties({
            request: 'абвгджз',
            index: 1,
            reason: 'Error: not found'
          });
          done();
        })
        .fail(done);
    });
  });
});
