'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = sdk;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function sdk() {
  var globalSpec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var defaultSpec = {
    origin: '',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  };
  var configuredSpec = (0, _lodash.merge)(defaultSpec, globalSpec);

  function apiFactory() {
    var instanceSpec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return (0, _api2['default'])((0, _lodash.merge)(configuredSpec, instanceSpec));
  }

  return apiFactory;
}

module.exports = exports['default'];