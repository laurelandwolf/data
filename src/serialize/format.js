import camelCase from 'lodash/string/camelcase';
import kebabCase from 'lodash/string/kebabCase';
import trimLeft from 'lodash/string/trimleft';
import startsWith from 'lodash/string/startswith';

function startsWithDash (str) {

  return startsWith(str, '-');
}

function removeFirstDash (str) {

  return trimLeft(str, '-');
}

function dashCase (data) {

  if (typeof data === 'string') {

    if (startsWithDash(data)) {
      return `-${kebabCase(removeFirstDash(data))}`;
    }
    else {
      return kebabCase(data);
    }
  }
}

export default {
  camelCase,
  dashCase
}
