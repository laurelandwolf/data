import {reduce} from 'lodash';
import isPromise from 'is-promise';

export default function bindActions (actions, dispatch) {

  return reduce(actions, (boundActions, fn, fnName) => {

    boundActions[fnName] = (...args) => {

      let action = fn(...args);

      if (typeof action === 'function') {
        return action(dispatch);
      }
      else if (isPromise(action)) {
        action.then(dispatch);
      }

      return dispatch(action);
    };

    return boundActions;
  }, {});
}
