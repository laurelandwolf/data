import {namespace} from 'tessed';

import serialize from '../../src/serialize';

let test = namespace('serialize exports');

test('properties and fuctions', ({equal}) => {

  equal(typeof serialize.normalize, 'object', 'normalize');
  equal(typeof serialize.normalize.response, 'function', 'normalize.response');
  equal(typeof serialize.format, 'object', 'format');
  equal(typeof serialize.format.camelCase, 'function', 'format.camelCase');
  equal(typeof serialize.format.dashCase, 'function', 'format.dashCase');
  equal(typeof serialize.response, 'function', 'response');
  equal(typeof serialize.request, 'function', 'request');
});
