import isPromise from 'is-promise';

export default function bindActions (actions, dispatch) {

  let boundActions = {};

  Object.keys(actions).forEach(fnName => {

    boundActions[fnName] = (...args) => {
      let action = actions[fnName](...args);

      if (typeof action === 'function') {
        return action(dispatch);
      }
      else if (isPromise(action)) {
        action.then(dispatch);
      }

      return dispatch(action);
    }
  });

  return boundActions;
};
