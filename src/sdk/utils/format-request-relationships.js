import _, {map} from 'lodash';
import pluralize from 'pluralize';
import isNumber from 'is-number';

function formatRequestRelationships (relationships) {

  return _(relationships)
    .map((data, name) => {

      // Handles shorthand and regular relationships
      // input syntax (see tests)
      if (isNumber(data)) {
        return [name, {
          data: {
            type: pluralize(name, 2),
            id: data
          }
        }];
      }
      else if(Array.isArray(data)) {
        return [name, {
          data: map(data, (val) => {

            if (isNumber(val)) {
              return {
                type: pluralize(name, 2),
                id: val
              };
            }
            else {
              return val;
            }
          })
        }];
      }
      else {
        return [name, {
          data
        }];
      }
    })
    .zipObject()
    .value();
}

export default formatRequestRelationships;
