import {Observable} from 'rx-lite'
import {merge} from 'lodash'

import api from './api'
import {DEFAULT_HEADERS} from './headers'

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: DEFAULT_HEADERS
  }
  let options = merge({}, defaultSpec, globalSpec)
  let stream = Observable.create()

  function apiFactory (instanceSpec = {}) {

  	return api(merge({}, options, instanceSpec, {
  		getStream: () => stream
  	}))
  }

  apiFactory.createStream = callback => stream = callback(options)

  return apiFactory
}
