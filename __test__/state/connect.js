import {namespace} from 'tessed';
import React from 'react';

import connect from '../../src/state/connect';
import createStore from '../../src/state/create-store';

let test = namespace('connect');

test.only('store with selector', () => {

  let initialState = {
    foo: 'bar',
    test: 'ing'
  };

  let myReducer = function (state, action) {

    switch (action.type) {
      default:
        return state;
    };
  };
  let store = createStore(myReducer, initialState);

  class TestComponent extends React.Component {

    render () {

      return <div>Testing</div>
    }
  }

  // connectStore or selectState ????
  let ConnectedComponent = connect(store)(state => state)(TestComponent);
});

test('selector only');
