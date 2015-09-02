'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _isNumber = require('is-number');

var _isNumber2 = _interopRequireDefault(_isNumber);

function formatRequestRelationships(relationships) {

  return (0, _lodash2['default'])(relationships).map(function (data, name) {

    // Handles shorthand and regular relationships
    // input syntax (see tests)
    if ((0, _isNumber2['default'])(data)) {
      return [name, {
        data: {
          type: (0, _pluralize2['default'])(name, 2),
          id: Number(data)
        }
      }];
    } else if (Array.isArray(data)) {
      return [name, {
        data: (0, _lodash.map)(data, function (val) {

          if ((0, _isNumber2['default'])(val)) {
            return {
              type: (0, _pluralize2['default'])(name, 2),
              id: Number(val)
            };
          } else {
            return val;
          }
        })
      }];
    } else {
      return [name, {
        data: data
      }];
    }
  }).zipObject().value();
}

exports['default'] = formatRequestRelationships;
module.exports = exports['default'];