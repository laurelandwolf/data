import {namespace} from 'tessed';

import format from '../../src/serialize/format';

let test = namespace('format');

test('String', ({equal}) => {

  equal(format.camelCase('kebab-case'), 'kebabCase', 'camel case');
  equal(format.dashCase('oneTwo'), 'one-two', 'snake case');
});

test('keeps the leading "-"', ({equal}) => {

  let cased = format.dashCase('-createdAt');
  equal(cased, '-created-at', 'keeps "-"');
});
