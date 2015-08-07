import mockFetch from 'mock-fetch';
import {namespace} from 'tessed';

import endpoint from '../../src/sdk/endpoint';
import circularRefsData from '../mock/circular-refs.json';

let test = namespace('endpoint');

test.beforeEach(() => {

  mockFetch.mock({
    response: {
      status: 200,
      body: {
        data: {
          type: 'projects',
          id: 1,
          attributes: {
            name: 'test'
          },
          relationships: {
            author: {
              data: {
                type: 'people',
                id: 2
              }
            }
          }
        },
        included: [
          {
            type: 'people',
            id: 2,
            attributes: {
              name: 'person'
            }
          }
        ]
      }
    }
  });
});

test.afterEach(() => mockFetch.restore());

test.skip('serializes response data', ({equal}) => {

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  return resource
    .then((res) => {

      equal(res.body.data.relationships.author.attributes.name, 'person', 'relationship attribute');

      // FIXME: this throws an error. Fix when serializing response
      // body.data.relationships.author.relationships;
    });
});

test.skip('serializes response included', ({equal}) => {

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  return resource
    .then((res) => {

      equal(res.body.included.people[2].attributes.name, 'person', 'included attribute');
    });
});

test.skip('ignore relationships in included resources', ({equal}) => {

  mockFetch.mock({
    response: {
      status: 200,
      body: circularRefsData
    }
  });

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  resource.include({
    rooms: [
      {
        type: 'photos',
        ignoreRelationships: ['rooms'] // singular or plural?
      }
    ]
  });

  return resource
    .then((res) => {

      equal(
        res.body.included.photos[14941].relationships.room.attributes,
        undefined,
        'did not merge circular room reference'
      );
      equal(
        res.body.included.photos[14941].relationships.room.__merged__,
        undefined,
        'never gets merged'
      );
      equal(
        res.body.included.photos[14941].relationships.room.id,
        '26098',
        'keeps relationship id');
    });
});

test.skip('ignore relationships in resource data', ({equal}) => {

  mockFetch.mock({
    response: {
      status: 200,
      body: circularRefsData
    }
  });

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  resource.include({
    rooms: [
      {
        type: 'photos',
        ignoreRelationships: ['rooms'] // singular or plural?
      }
    ]
  });

  return resource
    .then((res) => {

      equal(
        res.body.data.relationships.rooms[26098].relationships.photos[14941].relationships.room.attributes,
        undefined,
        'did not merge circular room reference in data object relationships'
      );
      equal(
        res.body.included.photos[14941].relationships.room.__merged__,
        undefined,
        'never gets merged'
      );
      equal(
        res.body.included.photos[14941].relationships.room.id,
        '26098',
        'keeps relationship id');
    });
});
