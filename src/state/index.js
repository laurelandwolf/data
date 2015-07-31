import * as actionCreators from './action-creators';
import * as reducers from './reducers';

import createStore from './utils/create-store';

export default function (initialState = {}) {

  let store = createStore(reducers, initialState);

  return {
    ...store,
    reducers,
    actionCreators
  };
}
