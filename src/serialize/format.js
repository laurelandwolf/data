import {
  map,
  startsWith,
  trimLeft,
  isObject as isObjectLoose,
  isString,
  camelCase as toCamelCase,
  kebabCase,
  forOwn
} from 'lodash';

function startsWithDash (str) {

  return startsWith(str, '-');
}

function removeFirstDash (str) {

  return trimLeft(str, '-');
}

function isObject (data) {

  return isObjectLoose(data) && !Array.isArray(data);
}

function camelCaseKeys (obj) {

  if (isString(obj) || !obj) {
    return obj;
  }

  let cameledObject = {};

  forOwn(obj, (value, key) => {

    let val = value;

    if (Array.isArray(value)) {
      val = map(value, camelCaseKeys);
    }
    else if (isObject(value)) {
      val = camelCaseKeys(value);
    }

    cameledObject[toCamelCase(key)] = val;
  });

  return cameledObject;
}

function snakeCaseKeys (obj) {

  if (isString(obj)) {
    return obj;
  }

  let snakedObject = {};

  forOwn(obj, (value, key) => {

    let val = value;

    if (Array.isArray(value)) {
      val = map(value, snakeCaseKeys);
    }
    else if (isObject(value)) {
      val = snakeCaseKeys(value);
    }

    snakedObject[kebabCase(key)] = val;
  });

  return snakedObject;
}

function camelCase (data) {

  if (!data) {
    return data;
  }

  if (isString(data)) {
    return toCamelCase(data);
  }

  if (isObject(data)) {
    return camelCaseKeys(data);
  }
}

function snakeCase (data) {

  if (!data) {
    return data;
  }

  if (isString(data)) {

    if (startsWithDash(data)) {
      return `-${kebabCase(removeFirstDash(data))}`;
    }
    else {
      return kebabCase(data);
    }
  }

  if (isObject(data)) {
    return snakeCaseKeys(data);
  }
}

export default {
  camelCase,
  snakeCase
};
