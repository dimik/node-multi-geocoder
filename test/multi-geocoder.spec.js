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
          parseInt(res.result.features[0].id).should.be.greaterThan(-1);
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
          parseInt(res.result.features[0].id).should.be.greaterThan(-1);
          res.errors.should.be.an.Array.with.lengthOf(1);
          res.errors[0].should.have.properties({
            request: 'абвгджз',
            index: 1,
            reason: 'GeoObject Not Found'
          });
          done();
        })
        .fail(done);
    });

    it('should use yandex apikey param', function (done) {
      var geocoder = new MultiGeocoder({ provider: 'yandex-cache' });
      var provider = geocoder.getProvider();
      var getRequestParams = provider.getRequestParams;
      provider.getRequestParams = function () {
        var result = getRequestParams.apply(provider, arguments);
        result.key = 'ALkm20kBAAAAK5CqfgMA_c1OWiL-mTzfZaqsZFYHh3AtLvMAAAAAAAAAAABUmTLmOgi_IJbIqdxmW92iEU4c8w==';
        return result;
      };
      geocoder.geocode(['Амстердам', 'Лондон', 'Париж'])
        .then(function (res) {
          res.result.features.should.be.an.Array.with.lengthOf(3);
          res.result.features[0].properties.description.should.match(/Голландия/);
          res.result.features[1].properties.description.should.match(/Англия/);
          res.result.features[2].properties.description.should.match(/Франция/);
          parseInt(res.result.features[0].id).should.be.greaterThan(-1);
          res.errors.should.be.an.Array.with.lengthOf(0);
          done();
        })
        .fail(done);
    });

    it('should return features from cache', function (done) {
      var geocoder = new MultiGeocoder({ provider: 'yandex-cache' });
      var provider = geocoder.getProvider();
      var cacheHit = 0;

      provider.events.on('requestfound', function (cacheKey) {
        cacheHit++;
      });

      geocoder.geocode(['Москва', 'Лондон', 'Париж'])
        .then(function (res) {
          res.result.features.should.be.an.Array.with.lengthOf(3);
          res.result.features[0].properties.name.should.be.eql('Москва');
          parseInt(res.result.features[0].id).should.be.greaterThan(-1);
          res.errors.should.be.an.Array.with.lengthOf(0);

          cacheHit.should.be.eql(0);

          return geocoder.geocode(['Москва', 'абвгджз', 'Лондон', 'Париж']);
        })
        .then(function (res) {
          res.result.features.should.be.an.Array.with.lengthOf(3);
          res.result.features[0].properties.name.should.be.eql('Москва');
          parseInt(res.result.features[0].id).should.be.greaterThan(-1);
          res.errors.should.be.an.Array.with.lengthOf(1);
          res.errors[0].should.have.properties({
            request: 'абвгджз',
            index: 1,
            reason: 'GeoObject Not Found'
          });

          cacheHit.should.be.eql(3);

          done();
        })
        .fail(function (err) {
            console.log(err);
            // done();
        });
    });

  });
});
