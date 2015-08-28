import {namespace} from 'tessed';

import {sdk, serialize} from '../src';
import serializeDirect from '../src/serialize';
import sdkDirect from '../src/sdk';

let test = namespace('root exports');

test('root', ({deepEqual}) => {

  deepEqual(sdk, sdkDirect, 'sdk');
  deepEqual(serialize, serializeDirect, 'serialize');
});
