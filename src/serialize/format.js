import {camelCase, kebabCase, trimLeft, startsWith} from 'lodash'

function startsWithDash (str) {

  return startsWith(str, '-')
}

function removeFirstDash (str) {

  return trimLeft(str, '-')
}

function dashCase (data) {

  if (typeof data === 'string') {

    if (startsWithDash(data)) {
      return `-${kebabCase(removeFirstDash(data))}`
    }
    else {
      return kebabCase(data)
    }
  }
}

export default {
  camelCase,
  dashCase
}
