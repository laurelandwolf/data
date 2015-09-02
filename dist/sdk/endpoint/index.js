'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _request = require('../request');

var _request2 = _interopRequireDefault(_request);

var _qsHash = require('./qs-hash');

var _qsHash2 = _interopRequireDefault(_qsHash);

var _qsList = require('./qs-list');

var _qsList2 = _interopRequireDefault(_qsList);

var _querySerializer = require('./query-serializer');

var _querySerializer2 = _interopRequireDefault(_querySerializer);

var _utilsFormatRequestRelationships = require('../utils/format-request-relationships');

var _utilsFormatRequestRelationships2 = _interopRequireDefault(_utilsFormatRequestRelationships);

function endpoint(_x, apiConfig) {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$uri = _ref.uri;
  var uri = _ref$uri === undefined ? '/' : _ref$uri;
  var _ref$method = _ref.method;
  var method = _ref$method === undefined ? 'GET' : _ref$method;
  var payload = _ref.payload;

  var req = (0, _request2['default'])(apiConfig);
  var includes = (0, _qsList2['default'])('include');
  var sort = (0, _qsList2['default'])('sort');
  var fields = (0, _qsHash2['default'])();
  var query = (0, _querySerializer2['default'])();

  function renderEndpointUri() {

    var querystring = [];

    if (includes.count() > 0) {
      querystring.push(includes.stringify());
    }

    if (fields.count() > 0) {
      querystring.push(fields.stringify());
    }

    //
    if (sort.count() > 0) {
      querystring.push(sort.stringify());
    }

    if (query.count() > 0) {
      querystring.push(query.stringify());
    }

    // Ensure that nothing extra gets put in the uri
    if (querystring.length > 0) {
      uri += '?' + querystring.join('&');
    }

    return uri;
  }

  // TODO: move this so it's only available to the requests that need it
  var relationships = {};

  var promise = new Promise(function (resolve, reject) {

    process.nextTick(function () {

      var requestUri = renderEndpointUri();
      var payloadBody = {};

      // Get relationships in there!
      if (!(0, _lodash.isEmpty)(relationships)) {
        payloadBody = (0, _lodash.merge)(payload || {}, { relationships: relationships });
      }

      // Serialize request
      if (!(0, _lodash.isEmpty)(payload)) {
        payloadBody = payload.relationships ? _extends({}, payload, {
          relationships: (0, _utilsFormatRequestRelationships2['default'])(payload.relationships)
        }) : payload;
      }

      req[method.toLowerCase()](requestUri, {
        data: payloadBody
      }).then(resolve)['catch'](reject);
    });
  });

  // Chainable methods for get requests
  if (method.toLowerCase() === 'get') {
    promise.include = function () {

      includes.push.apply(includes, arguments);
      return promise;
    };

    promise.fields = function () {

      fields.add.apply(fields, arguments);
      return promise;
    };

    promise.sort = function () {

      sort.push.apply(sort, arguments);
      return promise;
    };

    promise.query = function () {

      query.add.apply(query, arguments);
      return promise;
    };
  }

  // Chainable methods for post requests
  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'patch') {
    promise.relatedTo = function (rels) {

      relationships = (0, _lodash.merge)(relationships, rels);
      return promise;
    };

    promise.include = function () {

      includes.push.apply(includes, arguments);
      return promise;
    };
  }

  return promise;
}

exports['default'] = endpoint;
module.exports = exports['default'];