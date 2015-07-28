import cloneDeep from 'lodash/lang/clonedeep';
import raf from 'raf';

// TODO: handle passing in multiple reducers
export default function createStore (reducer, initialState = {}) {

  let currentState = cloneDeep(initialState);
  let subscribers = [];
  let dispatchCharged = false;

  function notifySubscribers () {

    subscribers.forEach(sub => sub());
    dispatchCharged = false;
  }

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
        raf(notifySubscribers);
      }

      currentState = reducer(currentState, action);
    }
  };
};
