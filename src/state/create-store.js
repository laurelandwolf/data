import {forEach, without} from 'lodash';
import raf from 'raf';
import Immutable from 'immutable';

// TODO: handle passing in multiple reducers
export default function createStore (reducer, initialState = {}) {

  let currentState = Immutable.fromJS(initialState);
  let subscribers = [];
  let dispatchCharged = false;

  function notifySubscribers () {

    forEach(subscribers, sub => sub());
    dispatchCharged = false;
  }

  function getState () {

    return currentState;
  }

  function replaceState (nextState) {

    let oldState = currentState;
    currentState = Immutable.fromJS(nextState);

    if (!oldState.equals(currentState) && !dispatchCharged) {
      dispatchCharged = true;
      raf(notifySubscribers);
    }
  }

  return {
    getState,
    subscribe (fn) {

      subscribers = subscribers.concat(fn);

      return function unsubscribe () {

        subscribers = without(subscribers, fn);
      };
    },
    dispatch (action) {

      let nextState = reducer(getState(), action);
      replaceState(nextState);
    }
  };
}
