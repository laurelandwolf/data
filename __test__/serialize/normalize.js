import {namespace} from 'tessed';

import normalize from 'lw-serialize/normalize';
import multiResponseData from '../mock/multi-response.json';

let test = namespace('format');
test.response = test.namespace('response');
test.request = test.namespace('request');

test.response('normalize and format response body', ({deepEqual, equal}) => {

  let response = normalize.response(multiResponseData);

  deepEqual(
    Object.keys(response),
    ['rooms', 'inspirationLinks', 'projectStuff'],
    'top level types as keys'
  );

  equal(response.inspirationLinks['9'].id, '9', 'keeps id in resource');
  deepEqual(Object.keys(response.inspirationLinks), ['9', '10'], 'index by id');
  equal(response.inspirationLinks['9'].type, 'inspirationLinks', 'formatted type');

  equal(
    response.inspirationLinks['9'].attributes.createdAt,
    '2015-07-31T15:00:43.362-07:00',
    'formatted attribute keys'
  );

  equal(
    response.projectStuff['31944'].relationships.designPackage.data.id,
    1,
    'formatted relationship keys'
  );
  equal(
    response.projectStuff['31944'].relationships.designPackage.data.type,
    'designPackage',
    'formatted relationship type from object'
  );
  equal(
    response.projectStuff['31944'].relationships.winner.data[1].type,
    'theWinner',
    'formatted relationship type from array'
  );
});
