import {namespace} from 'tessed';
import mockFetch from 'mock-fetch';
import {capitalize, camelCase} from 'lodash';
import pluralize from 'pluralize';

import api from '../../src/sdk/api';
import r from '../../src/sdk/resource';

let test = namespace('api');

let resources = [
  'projects',
  'designers',
  'rooms',
  'floor-plans',
  'comments',
  'photos',
  'inspiration-links',
  'inspiration-images',
  'design-package-floor-plans',
  'style-boards',
  'style-board-tags',
  'design-package-instructions',
  'furniture',
  'design-packages',
  'portfolio-images',
  'media',
  'shopping-list-items',
  'users'
];

let singletonResources = [
  'recipient',
  'card',
  'bank-account'
];

test('setup', () => mockFetch.mock());

resources.forEach((resource) => {

  let endpointName = capitalize(camelCase(resource));

  test(resource, ({equal}) => {

    let a = api();

    equal(typeof a[`get${endpointName}`], 'function', `GET ${resource}`);
    equal(typeof a[`get${pluralize(endpointName, 1)}`], 'function', `GET ${resource}/:id`);
    equal(typeof a[`create${pluralize(endpointName, 1)}`], 'function', `POST ${resource}`);
    equal(typeof a[`update${pluralize(endpointName, 1)}`], 'function', `PATCH ${resource}/:id`);
    equal(typeof a[`delete${pluralize(endpointName, 1)}`], 'function', `DELETE ${resource}/:id`);
  });
});

singletonResources.forEach((resource) => {

  let endpointName = capitalize(camelCase(resource));

  test(resource, ({equal}) => {

    let a = api();

    equal(typeof a[`get${endpointName}`], 'function', `GET ${resource}`);
    equal(typeof a[`create${endpointName}`], 'function', `POST ${resource}`);
    equal(typeof a[`update${endpointName}`], 'function', `PATCH ${resource}`);
    equal(typeof a[`delete${endpointName}`], 'function', `DELETE ${resource}`);
  })
});

test('multi-string resource names (camelCase)', ({pass, fail}) => {

  let bankAccount = () => r({type: 'bankAccount'});

  try {
    r({type: 'bankAccount'});
    fail('did not throw TypeError');
  }
  catch (e) {
    pass('#resource uses type validation');
  }
});

test('multi-string resource names (kebab-case)', ({equal}) => {

  let bankAccount = r({
    type: 'bank-account',
    singleton: true
  });

  return bankAccount.getBankAccount()
    .then((res) => {
      let req = mockFetch.request();

      equal(req.url, '/bank-account', 'url');
    });
});

test('teardown', () => mockFetch.mock());
