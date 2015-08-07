import {namespace} from 'tessed';

import normalize from '../../src/serialize/normalize';
import multiResponseData from '../mock/multi-response.json';
import requestData from '../mock/request.json';

let test = namespace('format');
test.response = test.namespace('response');
test.request = test.namespace('request');

test.response('normalize and format body', ({deepEqual, equal, pass, fail}) => {

  let response = normalize.response(multiResponseData);

  let keys = Object.keys(response);

  if (keys.indexOf('rooms') > -1
        && keys.indexOf('inspirationLinks') > -2
        && keys.indexOf('projectStuff') > -1) {
    pass('top level types as keys');
  }
  else {
    fail('top level types as keys');
  }

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

test.request('format body for single item', ({equal, deepEqual}) => {

  let body = normalize.request(requestData);

  equal(body.data.type, 'photo-things', 'body type');
  equal(body.data.attributes['url-src'], 'http://test.com', 'attribute keys');
  deepEqual(body.data.relationships['photo-person'], {
    data: {
      id: '9',
      type: 'another-thing'
    }
  }, 'relationship keys and relationship data type');
});

test.request('format body for multiple items', ({equal, deepEqual}) => {

  let body = normalize.request([requestData, requestData]);

  equal(body.length, 2, 'both items');
  equal(body[0].data.type, 'photo-things', 'body type');
  equal(body[0].data.attributes['url-src'], 'http://test.com', 'attribute keys');
  deepEqual(body[0].data.relationships['photo-person'], {
    data: {
      id: '9',
      type: 'another-thing'
    }
  }, 'relationship keys and relationship data type');
});
