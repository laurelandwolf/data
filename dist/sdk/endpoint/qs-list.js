'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _serializeFormat = require('../../serialize/format');

function qslist(name) {

  var list = [];
  var includesWithOptions = [];

  function parseList(includes) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var newIncludes = (0, _lodash2['default'])(args).map(function (item) {

      // i.e. rooms.inspirationLinks
      if ((0, _lodash.isString)(item)) {
        return (0, _lodash.map)(item.split('.'), _serializeFormat.dashCase).join('.');
      }

      // i.e. - {rooms: ['inspirationLinks']}
      return (0, _lodash.map)(item, function (vals, field) {

        return (0, _lodash.map)(vals, function (val) {

          var type = val;

          // i.e. - {rooms: [{type: 'photos', ignoreRelationships: ['rooms']}]}
          if ((0, _lodash.isObject)(type)) {
            type = val.type;
            includesWithOptions.push(val);
          }

          return (0, _serializeFormat.dashCase)(field) + '.' + (0, _serializeFormat.dashCase)(type);
        });
      });
    }).flattenDeep().value();

    return includes.concat(newIncludes);
  }

  return {
    push: function push() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      list = parseList.apply(undefined, [list].concat(args));
    },

    stringify: function stringify() {

      return (0, _serializeFormat.dashCase)(name) + '=' + list.join(',');
    },

    count: function count() {

      return list.length;
    },

    ignoreRelationships: function ignoreRelationships() {

      return includesWithOptions;
    }
  };
}

exports['default'] = qslist;
module.exports = exports['default'];