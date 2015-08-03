import _, {
  isString,
  map,
  isObject
} from 'lodash';

import {dashCase} from 'lw-serialize/format';

function qslist (name) {

  let list = [];
  let includesWithOptions = [];

  function parseList (includes, ...args) {

    let newIncludes = _(args)
      .map(item => {

        // i.e. rooms.inspirationLinks
        if (isString(item)) {
          return map(item.split('.'), dashCase).join('.');
        }

        // i.e. - {rooms: ['inspirationLinks']}
        return map(item, (vals, field) => {

          return map(vals, (val) => {

            let type = val;

            // i.e. - {rooms: [{type: 'photos', ignoreRelationships: ['rooms']}]}
            if (isObject(type)) {
              type = val.type;
              includesWithOptions.push(val);
            }

            return `${dashCase(field)}.${dashCase(type)}`;
          });
        });
      })
      .flattenDeep()
      .value();

    return includes.concat(newIncludes);
  }

  return {
    push (...args) {

      list = parseList(list, ...args);
    },

    stringify () {

      return `${dashCase(name)}=${list.join(',')}`;
    },

    count () {

      return list.length;
    },

    ignoreRelationships () {

      return includesWithOptions;
    }
  };
}

export default qslist;
