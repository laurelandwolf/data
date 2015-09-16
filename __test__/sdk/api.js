import {namespace} from 'tessed';
import mockFetch from 'mock-fetch';
import {capitalize, camelCase} from 'lodash';
import pluralize from 'pluralize';

import api from '../../src/sdk/api';
import r from '../../src/sdk/resource';

let resources = require('./resources');
let singletonResources = require('./singleton-resources');

let test = namespace('api');
test.beforeEach(() => mockFetch.mock());
test.afterEach(() => mockFetch.restore());

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

test.fetch = test.namespace('fetch');
test.fetch.beforeEach(() => mockFetch.mock());
test.fetch.afterEach(() => mockFetch.restore());

test.fetch('arbitary paths with origin', ({equal}) => {

  return api({
    origin: 'http://test.com'
  })
    .fetch('/my-custom-path')
    .then(response => {

      let req = mockFetch.request();

      equal(response.status, 200, 'status code');
      equal(req.method, 'GET', 'default method');
      equal(req.url, 'http://test.com/my-custom-path', 'url with origin');
    });
});

test.fetch('with options', ({equal}) => {

  return api()
    .fetch('/test', {
      method: 'POST',
      body: 'my-data'
    })
    .then(response => {

      let req = mockFetch.request();
      equal(req.method, 'POST', 'method from options');
      equal(req.body, 'my-data', 'body from options');
    });
});
