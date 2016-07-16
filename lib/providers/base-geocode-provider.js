var vow = require('vow'),
  EventEmitter = require('events').EventEmitter,
  inherit = require('inherit'),
  agent = require('superagent'),
  util = require('util'),
  _ = require('lodash');

module.exports = inherit( /** @lends GeocoderProvider.prototype */ {

  __constructor: function(options) {
    this.events = new EventEmitter();
    this._options = _.extend({}, options);
  },

  geocode: function(point, options) {
    var defer = vow.defer(),
      events = this.events,
      onFail = function(err) {
        events.emit('requestfail', err);
        defer.reject(err);
      },
      onSuccess = function(result) {
        events.emit('requestsuccess', result);
        defer.resolve(result);
      };

    this.events.emit('requeststart');

    agent
      .get(this.getRequestUrl())
      .accept('json')
      .query(_.extend({}, this.getRequestParams(point), options))
      .end(function(err, res) {
        defer.notify(util.format('Processed: "%s"', this.getText(point)));
        if (err) {
          return onFail(err);
        }
        onSuccess(this.process(res.body));
        this.events.emit('requestend');
      }.bind(this));

    return defer.promise();
  },

  process: function(result) {
    return result;
  },

  getRequestUrl: function() {
    return '';
  },

  getRequestParams: function(point) {
    return {};
  },

  getText: function(point) {
    return point;
  }

});
