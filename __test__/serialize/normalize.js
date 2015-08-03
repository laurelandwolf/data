import {namespace} from 'tessed';

import normalize from 'lw-serialize/normalize';
import singleResponseData from '../mock/single-response.json';

let test = namespace('format');
test.response = test.namespace('response');
test.request = test.namespace('request');

test.response('format "included" items array to key indexed object', ({equal, pass, fail, deepEqual}) => {

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

test.response('format "data"', ({equal}) => {

  let {data} = normalize.response(singleResponseData);

  equal(data.type, 'projectStuff', 'data type');
  equal(data.attributes.homeOwnership, 'home ownership', 'attributes keys');

  equal(
    data.relationships.designPackage.data.type,
    'designPackage',
    'relationships data type as object'
  );

  equal(
    data.relationships.winner.data[0].type,
    'theWinner',
    'relationships data type as array'
  );
});
