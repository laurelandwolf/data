'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _lodash = require('lodash');

var _asArray = require('as-array');

var _asArray2 = _interopRequireDefault(_asArray);

var _format = require('./format');

function formatRelationshipData(resource) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.camelCase : arguments[1];

  if (Array.isArray(resource.data)) {
    resource.data = (0, _lodash.map)(resource.data, function (data) {

      return _extends({}, data, {
        type: formatter(data.type)
      });
    });
  } else if (typeof resource.data === 'object' && resource.data !== null) {
    resource.data.type = formatter(resource.data.type);
  }

  return resource;
}

function formatRelationships(relationships) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.camelCase : arguments[1];

  return (0, _lodash.reduce)(relationships, function (rels, value, typeName) {

    rels[formatter(typeName)] = formatRelationshipData(value, formatter);
    return rels;
  }, {});
}

function formatAttributes(attributes) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.camelCase : arguments[1];

  return (0, _lodash.reduce)(attributes, function (attrs, value, attrKey) {

    attrs[formatter(attrKey)] = value;
    return attrs;
  }, {});
}

function formatResources(included) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.camelCase : arguments[1];

  if (!included) {
    return included;
  }

  return (0, _lodash.reduce)(included, function (result, resource) {

    var type = formatter(resource.type);

    result[type] = _extends({}, result[type], _defineProperty({}, resource.id, _extends({}, resource, {
      type: formatter(resource.type),
      attributes: formatAttributes(resource.attributes, formatter),
      relationships: formatRelationships(resource.relationships, formatter)
    })));

    return result;
  }, {});
}

function formatResourceRequest(data) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.dashCase : arguments[1];

  if (!data) {
    return data;
  }

  return _extends({}, data, {
    type: formatter(data.type),
    attributes: formatAttributes(data.attributes, formatter),
    relationships: formatRelationships(data.relationships, formatter)
  });
}

function normalizeResponse(_ref) {
  var data = _ref.data;
  var included = _ref.included;
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.camelCase : arguments[1];

  return _extends({}, formatResources((0, _asArray2['default'])(data), formatter), formatResources(included, formatter));
}

function normalizeRequest(data) {
  var formatter = arguments.length <= 1 || arguments[1] === undefined ? _format.dashCase : arguments[1];

  function formatRequest(body) {

    return _extends({}, body, {
      data: formatResourceRequest(body.data, formatter)
    });
  }

  return Array.isArray(data) ? (0, _lodash.map)(data, formatRequest) : formatRequest(data);
}

exports['default'] = {
  response: normalizeResponse,
  request: normalizeRequest
};
module.exports = exports['default'];