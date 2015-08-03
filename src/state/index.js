import * as actionCreators from './action-creators';
import * as reducers from './reducers';

import createStore from './create-store';

export default function (initialState = {}) {

  let store = createStore(reducers, initialState);

  return {
    ...store,
    reducers,
    actionCreators
  };
}
