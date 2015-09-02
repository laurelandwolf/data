'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _lodash = require('lodash');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _utilsValidate = require('./utils/validate');

var _utilsValidate2 = _interopRequireDefault(_utilsValidate);

var _endpoint = require('./endpoint');

var _endpoint2 = _interopRequireDefault(_endpoint);

function resourceName(method, type) {
  var plural = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  return '' + method.toLowerCase() + (0, _lodash.capitalize)((0, _pluralize2['default'])((0, _lodash.camelCase)(type), plural ? 2 : 1));
}

function resource(spec) {
  var _routes;

  var globalConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _defaults = (0, _lodash.defaults)(spec, { singleton: false });

  var type = _defaults.type;
  var singleton = _defaults.singleton;

  _utilsValidate2['default'].type(type);

  function uri(id) {

    var u = '/' + type;
    if (!singleton && id !== undefined) {
      u += '/' + id;
    }

    return u;
  }

  // Get All
  function getAll() {

    return (0, _endpoint2['default'])({
      uri: uri(),
      method: 'GET'
    }, globalConfig);
  }

  function getOne(id) {

    return (0, _endpoint2['default'])({
      uri: uri(id),
      method: 'GET'
    }, globalConfig);
  }

  function create(attributes) {

    var payload = {
      type: type,
      attributes: attributes
    };

    return (0, _endpoint2['default'])({
      uri: uri(),
      method: 'POST',
      payload: payload
    }, globalConfig);
  }

  function update(id, attributes) {

    if (typeof id === 'object') {
      attributes = id;
      id = undefined;
    }

    var payload = {
      type: type,
      id: id,
      attributes: attributes
    };

    return (0, _endpoint2['default'])({
      uri: uri(id),
      method: 'PATCH',
      payload: payload
    }, globalConfig);
  }

  function del(id) {

    return (0, _endpoint2['default'])({
      uri: uri(id),
      method: 'DELETE'
    }, globalConfig);
  }

  var routes = (_routes = {}, _defineProperty(_routes, resourceName('get', type), getOne), _defineProperty(_routes, resourceName('create', type), create), _defineProperty(_routes, resourceName('update', type), update), _defineProperty(_routes, resourceName('delete', type), del), _routes);

  if (!singleton) {
    routes[resourceName('get', type, true)] = getAll;
  }

  return routes;
}

exports['default'] = resource;
module.exports = exports['default'];