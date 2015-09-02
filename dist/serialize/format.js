'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

function startsWithDash(str) {

  return (0, _lodash.startsWith)(str, '-');
}

function removeFirstDash(str) {

  return (0, _lodash.trimLeft)(str, '-');
}

function dashCase(data) {

  if (typeof data === 'string') {

    if (startsWithDash(data)) {
      return '-' + (0, _lodash.kebabCase)(removeFirstDash(data));
    } else {
      return (0, _lodash.kebabCase)(data);
    }
  }
}

exports['default'] = {
  camelCase: _lodash.camelCase,
  dashCase: dashCase
};
module.exports = exports['default'];