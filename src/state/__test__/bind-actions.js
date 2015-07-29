require('es6-promise').polyfill();

import {namespace} from './utils/testing';
import bindActions from '../utils/bind-actions';
import createStore from '../utils/create-store';

let test = namespace('bindActions');

const TEST_ACTION = 'TEST_ACTION';

test.beforeEach(() => {

  function testReducer (state, action) {

    switch (action.type) {
      default:
        return {
          ...state,
          foo: action.foo
        };
    }
  }
  let store = createStore(testReducer);

  return {
    store
  };
});

test('dispatches on action execution', ({deepEqual, context}) => {

  let store = context.store;
  function testAction (foo) {

    return {
      type: TEST_ACTION,
      foo
    }
  }

  let actionCreators = bindActions({testAction}, store.dispatch);
  actionCreators.testAction('bar');

  return function (end) {

    store.subscribe(() => {

      deepEqual(store.getState(), {foo: 'bar'}, 'action fired');
      end();
    });
  };
});

test('action returns a thunk', ({context, deepEqual}) => {

  let store = context.store;
  function testAction (foo) {

    return function (dispatch) {

      dispatch({
        type: TEST_ACTION,
        foo
      });
    };
  }

  let actionCreators = bindActions({testAction}, store.dispatch);
  actionCreators.testAction('bar');

  return function (end) {

    store.subscribe(() => {

      deepEqual(store.getState(), {foo: 'bar'}, 'action fired');
      end();
    });
  };
});

test('action returns a promise', ({context, deepEqual}) => {

  let store = context.store;
  function testAction (foo) {

    return new Promise((resolve, reject) => {

      resolve({
        type: TEST_ACTION,
        foo
      });
    });
  }

  let actionCreators = bindActions({testAction}, store.dispatch);
  actionCreators.testAction('bar');

  return function (end) {

    store.subscribe(() => {

      deepEqual(store.getState(), {foo: 'bar'}, 'action fired');
      end();
    });
  };
});
