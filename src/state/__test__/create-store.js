import {namespace} from './utils/testing';
import createStore from '../utils/create-store';

let test = namespace('createStore');

test.beforeEach(() => {

  return {
    reducer ({state, action}) {

      return {
        state: 'new'
      };
    }
  }
});

test('store state', ({deepEqual, equal, context}) => {

  let initialState = {foo: 'bar'};
  let store = createStore(context.reducer, initialState);
  let called = 0;

  deepEqual(store.getState(), initialState, 'got the state');

  initialState.foo = 'baz';
  deepEqual(store.getState(), {foo: 'bar'}, 'clones the state');

  store.dispatch({});
  deepEqual(store.getState(), {state: 'new'}, 'sets state from reducers');


});

test('subscxribe to store', ({deepEqual, context}) => {

  let initialState = {foo: 'bar'};
  let store = createStore(context.reducer, initialState);

  store.dispatch({});
  store.dispatch({});
  store.dispatch({});

  return function (end) {

    store.subscribe(() => {

      deepEqual(store.getState(), {state: 'new'}, 'sets state from reducers');
      end();
    });
  };
});

test('unsubscribe from store', ({context, equal}) => {

  let store = createStore(context.reducer);

  return function (end) {

    let unsubscribe = store.subscribe(() => end());

    equal(typeof unsubscribe, 'function', 'returns unsubscribe function');

    unsubscribe();
    store.subscribe(() => end());
    store.dispatch({});
  };
});

test('argument order in reducers', ({equal, deepEqual}) => {

  let called = false;

  function reducer (state, action) {

    called = true;

    deepEqual(state, {foo: 'bar'}, 'state passed as 1st argument');
    deepEqual(action, {type: 'test'}, 'action passed as 2nd argument');
  }

  let store = createStore(reducer, {foo: 'bar'});

  return function (end) {

    store.subscribe(() => {

      equal(called, true, 'called reducer');
      end()
    });
    store.dispatch({type: 'test'});
  };
});

test.skip('multiple reducers', () => {

  let initialState = {
    reducer1: 'foo',
    reducer2: 'bar'
  };
  function reducer1 (state, action) {

  }
  function reducer2 (state, action) {

  }

  let store = createStore({reducer1, reducer1}, initialState);

  return function (end) {

    store.subscribe(() => {



      end();
    });
    store.dispatch();
  };
});
