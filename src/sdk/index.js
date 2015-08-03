import {merge} from 'lodash';

import api from './api';

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  };
  let configuredSpec = merge(defaultSpec, globalSpec);

  function apiFactory (instanceSpec = {}) {

    return api(merge(configuredSpec, instanceSpec));
  }

  return apiFactory;
}
