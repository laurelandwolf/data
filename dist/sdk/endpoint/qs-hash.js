'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _asArray = require('as-array');

var _asArray2 = _interopRequireDefault(_asArray);

var _serializeFormat = require('../../serialize/format');

function qshash() {

  var list = {};

  function parseFields(fields) {
    for (var _len = arguments.length, newFields = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      newFields[_key - 1] = arguments[_key];
    }

    (0, _lodash2['default'])(newFields).map(function (field) {

      // Convert to formatted object
      if (typeof field === 'string') {
        var _field$split = field.split('.');

        var _field$split2 = _slicedToArray(_field$split, 2);

        var rel = _field$split2[0];
        var _name = _field$split2[1];

        field = _defineProperty({}, (0, _serializeFormat.dashCase)(rel), (0, _serializeFormat.dashCase)(_name));
      }

      return field;
    }).forEach(function (fieldsMap) {

      (0, _lodash.forEach)(fieldsMap, function (val, key) {

        var name = (0, _serializeFormat.dashCase)(key);
        var values = (0, _lodash.map)((0, _asArray2['default'])(val), _serializeFormat.dashCase);

        fields[name] = (0, _lodash.union)(fields[name], values);
      });
    }).value();

    return fields;
  }

  return {
    add: function add() {
      for (var _len2 = arguments.length, newFields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        newFields[_key2] = arguments[_key2];
      }

      list = parseFields.apply(undefined, [list].concat(newFields));
    },

    stringify: function stringify() {

      return (0, _lodash.map)(list, function (values, scope) {

        return 'fields[' + scope + ']=' + values.join(',');
      }).join('&');
    },

    count: function count() {

      return Object.keys(list).length;
    }
  };
}

exports['default'] = qshash;
module.exports = exports['default'];