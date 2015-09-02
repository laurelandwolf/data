'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _normalize = require('./normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

exports['default'] = _extends({}, _normalize2['default'], {
  normalize: _normalize2['default'],
  format: _format2['default']
});
module.exports = exports['default'];