import api from './api'
import {DEFAULT_HEADERS} from './headers'

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: DEFAULT_HEADERS
  }
  let configuredSpec = {...defaultSpec, ...globalSpec}

  function apiFactory (instanceSpec = {}) {

    return api({
    	...configuredSpec,
    	...instanceSpec
    })
  }

  return apiFactory
}
