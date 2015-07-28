import * as actionCreators from './action-creators';
import * as actions from './actions';
import * as reducers from './reducers';

import createStore from './utils/create-store';

export default function (initialState = {}) {

  let store = createStore(reducers, initialState);

  return {

  };
};
