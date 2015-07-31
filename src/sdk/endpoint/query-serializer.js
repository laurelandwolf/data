import {
  isString,
  isObject,
  isNumber,
  all,
  each
} from 'lodash';

function querySerializer () {

  let list = [];

  function serialize (object, prefix) {

    let qs = [];
    each(object, (value, key) => {

      let paramKey = isNumber(key) ? '' : key;
      let k = prefix ? `${prefix}[${paramKey}]` : key;
      let serialized =
        typeof value === 'object'
          ? serialize(value, k)
          : [k, value].map(encodeURIComponent).join('=');
      qs.push(serialized);
    });
    return qs.join('&');
  }

  function parseQueries (queries, ...newQueries) {

    let newQuery;
    if (all(newQueries, isString) && newQueries.length === 2) {
      newQuery = newQueries.map(encodeURIComponent).join('=');
    }
    else if (isObject(...newQueries)) {
      newQuery = serialize(newQueries);
    }

    return queries.concat(newQuery);
  }

  return {
    add (...queries) {

      list = parseQueries(list, ...queries);
    },

    stringify () {

      return list.join('&');
    },

    count () {

      return list.length;
    }
  };
}

export default querySerializer;
