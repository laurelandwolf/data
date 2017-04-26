import {Observable} from 'rx-lite'
import {merge} from 'lodash'

import api from './api'
import {DEFAULT_HEADERS} from './headers'

function configGlobalSpec (globalSpec) {

  let headers
  if (typeof globalSpec.headers === 'function') {
    headers = globalSpec.headers()
  }
  else {
    headers = globalSpec.headers
  }

  return {
    ...globalSpec,
    headers
  }
}

function configOptions (globalSpec, instanceSpec = {}) {

  const defaultSpec = {
    origin: '',
    headers: DEFAULT_HEADERS
  }

  return merge({}, defaultSpec, configGlobalSpec(globalSpec), instanceSpec)
}

export default function sdk (globalSpec = {}) {

  let stream = Observable.create()

  function apiFactory (instanceSpec = {}) {

    return api({
      ...configOptions(globalSpec, instanceSpec),
      getStream: () => stream
    })
  }

  apiFactory.createStream = callback => stream = callback(configOptions(globalSpec))


  return apiFactory
}
