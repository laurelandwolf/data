import raf from 'raf';
import Freezer from 'freezer-js';

// TODO: handle passing in multiple reducers
export default function createStore (reducer, initialState = {}) {

  let currentState = new Freezer(initialState);
  let subscribers = [];
  let dispatchCharged = false;

  function notifySubscribers () {

    subscribers.forEach(sub => sub());
    dispatchCharged = false;
  }

  function getState () {

    return currentState.get();
  }

  function replaceState (nextState) {

    currentState.get().reset(nextState);
  }

  return {
    getState,
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

      replaceState(reducer(getState(), action));
    }
  };
}
