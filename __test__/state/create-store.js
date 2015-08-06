import Immutable from 'immutable';

import {namespace} from 'tessed';
import createStore from 'lw-state/create-store';

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

  deepEqual(store.getState().toJS(), initialState, 'got the state');

  initialState.foo = 'baz';
  deepEqual(store.getState().toJS(), {foo: 'bar'}, 'clones the state');

  store.dispatch({});
  deepEqual(store.getState().toJS(), {state: 'new'}, 'sets state from reducers');
});

test('subscribe to store', ({deepEqual, context}) => {

  let initialState = {foo: 'bar'};
  let store = createStore(context.reducer, initialState);

  store.dispatch({});
  store.dispatch({});
  store.dispatch({});

  return function (end) {

    store.subscribe(() => {

      deepEqual(store.getState().toJS(), {state: 'new'}, 'sets state from reducers');
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

    deepEqual(state.toJS(), {foo: 'bar'}, 'state passed as 1st argument');
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

// See: https://github.com/gaearon/redux/blob/improve-docs/docs/store.md
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

test('immutable data', ({context, equal, notEqual}) => {

  function immutableTestReducer (state, action) {

    switch(action.type) {
      default:
        return state.set(
          'foo',
          Immutable.fromJS({bar: 'bez'})
        );
    }
  }

  let initialState = {
    foo: {bar: 'baz'},
    test: {me: 'now'}
  };
  let store = createStore(immutableTestReducer, initialState);
  let immutableState = store.getState();

  store.dispatch({});

  return function (end) {

    store.subscribe(() => {

      // Shallow equal comparison proves that the reference is the same
      equal(store.getState().get('test'), immutableState.get('test'), 'only updated reference on changed tree');
      notEqual(store.getState().get('foo'), immutableState.get('foo'), 'new tree created for state updated');
      end();
    });
  };
});
