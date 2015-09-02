'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _joinPath = require('join-path');

var _joinPath2 = _interopRequireDefault(_joinPath);

function request() {
  var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!window.Promise) {
    throw new Error('window.Promise not supported. Please provide a plolyfill.');
  }

  if (!window.fetch) {
    throw new Error('window.fetch not supported. Please provide a plolyfill.');
  }

  var origin = spec.origin || '';
  var defaultMethod = 'GET';

  // Options that are used for every request
  var fetchConfig = (0, _lodash.omit)(spec, 'origin', 'fetch');

  function httpRequest(url, options) {

    return new window.Promise(function (resolve, reject) {

      // Latest custom fetch options
      if (options) {
        fetchConfig = (0, _lodash.merge)(fetchConfig, options);
      }

      fetchConfig = (0, _lodash.merge)({ method: defaultMethod }, fetchConfig);

      window.fetch((0, _joinPath2['default'])(origin, url), fetchConfig).then(function (response) {

        // NOTE: there is no body on a 204 response,
        //       so there will be nothing to parse

        if (response.status === 204) {
          resolve({
            status: response.status,
            headers: response.headers
          });
        } else {

          // TODO: check res.headers.get('Content-Type') to see
          //       if json should even be parsed
          var contentType = 'json';
          var contentTypeGetter = (0, _lodash.get)(response, 'headers.get');
          if (contentTypeGetter) {
            contentType = response.headers.get('content-type').indexOf('vnd.api+json') > -1 ? 'json' : 'text';
          }
          response[contentType]().then(function (body) {

            if (response.status < 400) {
              resolve({
                status: response.status,
                headers: response.headers,
                body: body
              });
            } else {
              var responseObject = (0, _lodash.merge)((0, _lodash.pick)(response, 'status', 'statusText'), { body: body });
              reject(responseObject);
            }
          });
        }
      });
    });
  }

  function get(url) {

    return httpRequest(url, {
      method: 'GET'
    });
  }

  function post(url) {
    var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return httpRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  function put(url) {
    var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return httpRequest(url, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  function patch(url) {
    var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return httpRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  function del(url) {

    return httpRequest(url, {
      method: 'DELETE'
    });
  }

  return {
    fetch: httpRequest,
    get: get,
    post: post,
    put: put,
    patch: patch,
    'delete': del
  };
}

exports['default'] = request;
module.exports = exports['default'];