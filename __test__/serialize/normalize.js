import {namespace} from 'tessed';

import normalize from 'lw-serialize/normalize';
import singleResponseData from '../mock/single-response.json';

let test = namespace('normalize');
test.response = test.namespace('response');
test.request = test.namespace('request');

test.response('normalize "included" items array to key indexed object', ({equal, pass, fail, deepEqual}) => {

  let {included} = normalize.response(singleResponseData);

  equal(Array.isArray(included), false, 'not an array');
  equal(included.rooms['70683'].type, 'rooms', 'indexed by id');
  equal(included.inspirationLinks['9'].type, 'inspirationLinks', 'camel case all the types');

  included.rooms['70683'].relationships.inspirationLinks !== undefined
    ? pass('camel case relationship type keys')
    : fail('camel case relationship type keys');

  equal(
    included.rooms['70683'].relationships.inspirationLinks.data[0].type,
    'inspirationLinks',
    'relationships data type as array'
  );
  equal(
    included.rooms['70683'].relationships.somethingElse.data.type,
    'somethingElse',
    'relationships data type as object'
  );

  deepEqual(
    included.rooms['70683'].attributes.roomFeels,
    ['cozy', 'formal'],
    'attribute keys'
  );
});

test.response('normalize "data"', () => {

  let {data} = normalize.response(singleResponseData);
  console.log(data);
});
