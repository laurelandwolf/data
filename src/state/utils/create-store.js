import cloneDeep from 'lodash/lang/clonedeep';

// TODO: handle passing in multiple reducers
export default function createStore (reducer, initialState = {}) {

  let currentState = cloneDeep(initialState);
  let subscribers = [];
  let dispatchCharged = false;

  return {
    getState () {

      return currentState
    },
    subscribe (fn) {

      subscribers.push(fn);

      return function unsubscribe () {

        let idx = subscribers.indexOf(fn);
        subscribers.splice(idx, 1);
      };
    },
    dispatch (action) {

      if (!dispatchCharged) {
        dispatchCharged = true;
        setTimeout(function () {

          subscribers.forEach(sub => sub());
          dispatchCharged = false;
        }, 0);
      }

      currentState = reducer(currentState, action);
    }
  };
};
