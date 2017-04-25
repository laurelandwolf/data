import {Observable} from 'rx-lite'
import {merge} from 'lodash'

import api from './api'
import {DEFAULT_HEADERS} from './headers'

function configGlobalSpec (globalSpec) {

  let headers
  if (typeof globalSpec.headers === 'function') {
    headers = {...globalSpec.headers()}
  }
  else {
    headers = globalSpec.headers
  }

  return {
    ...globalSpec,
    ...{headers}
  }
}

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: DEFAULT_HEADERS
  }

  let options = merge({}, defaultSpec, configGlobalSpec(globalSpec))

  let stream = Observable.create()

  function apiFactory (instanceSpec = {}) {

    options = merge({}, defaultSpec, configGlobalSpec(globalSpec))
    return api(merge({}, options, instanceSpec, {
        getStream: () => stream
    }))
  }
  apiFactory.createStream = callback => stream = callback(options)


  return apiFactory
}
