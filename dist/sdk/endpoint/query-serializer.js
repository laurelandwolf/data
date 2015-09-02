'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

function querySerializer() {

  var list = [];

  function serialize(object, prefix) {

    var qs = [];
    (0, _lodash.forEach)(object, function (value, key) {

      var paramKey = typeof key === 'number' ? '' : key;
      var k = prefix ? prefix + '[' + paramKey + ']' : key;
      var serialized = typeof value === 'object' ? serialize(value, k) : [k, value].map(encodeURIComponent).join('=');
      qs.push(serialized);
    });
    return qs.join('&');
  }

  function parseQueries(queries) {

    var newQuery = undefined;

    for (var _len = arguments.length, newQueries = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      newQueries[_key - 1] = arguments[_key];
    }

    if ((0, _lodash.all)(newQueries, _lodash.isString) && newQueries.length === 2) {
      newQuery = newQueries.map(encodeURIComponent).join('=');
    } else if (_lodash.isObject.apply(undefined, newQueries)) {
      newQuery = serialize(newQueries);
    }

    return queries.concat(newQuery);
  }

  return {
    add: function add() {
      for (var _len2 = arguments.length, queries = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        queries[_key2] = arguments[_key2];
      }

      list = parseQueries.apply(undefined, [list].concat(queries));
    },

    stringify: function stringify() {

      return list.join('&');
    },

    count: function count() {

      return list.length;
    }
  };
}

exports['default'] = querySerializer;
module.exports = exports['default'];