import {merge} from 'lodash';

import api from './api';
import {DEFAULT_HEADERS} from './headers';

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: DEFAULT_HEADERS
  };
  let configuredSpec = merge({}, defaultSpec, globalSpec);

  function apiFactory (instanceSpec = {}) {

    return api(merge({}, configuredSpec, instanceSpec));
  }

  return apiFactory;
}
