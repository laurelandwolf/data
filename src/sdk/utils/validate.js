import {isObject} from 'lodash';

function attributes (obj) {

  let isValid = obj && isObject(obj);

  if (!isValid) {
    throw new TypeError('Invalid attributes');
  }
}

function type (name) {

  if (!name && name !== 0) {
    throw new TypeError('Resource type is required');
  }

  if (name.match(/[^(a-z)\d\-]/)) {
    throw new TypeError('Invalid resource type');
  }
}

export default {
  attributes,
  type
};
