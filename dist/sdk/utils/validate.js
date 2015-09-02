'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function attributes(obj) {

  var isValid = obj && typeof obj === 'object';

  if (!isValid) {
    throw new TypeError('Invalid attributes');
  }
}

function type(name) {

  if (!name && name !== 0) {
    throw new TypeError('Resource type is required');
  }

  if (name.match(/[^(a-z)\d\-]/)) {
    throw new TypeError('Invalid resource type');
  }
}

exports['default'] = {
  attributes: attributes,
  type: type
};
module.exports = exports['default'];