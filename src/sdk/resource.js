import {capitalize, defaults, camelCase} from 'lodash'
import pluralize from 'pluralize'

import validate from './utils/validate'
import endpoint from './endpoint'

function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(pluralize(camelCase(type), plural ? 2 : 1))}`
}

function resource (spec, globalConfig = {}) {

  let {type, singleton} = defaults(spec, {singleton: false})

  validate.type(type)

  function uri (id) {

    let u = `/${type}`
    if (!singleton && id !== undefined) {
      u += `/${id}`
    }

    return u
  }

  // Get All
  function getAll () {

    return endpoint({
      uri: uri(),
      method: 'GET'
    }, globalConfig)
  }

  function getOne (id) {

    return endpoint({
      uri: uri(id),
      method: 'GET'
    }, globalConfig)
  }

  function create (attributes) {

    let payload = {
      type,
      attributes
    }

    return endpoint({
      uri: uri(),
      method: 'POST',
      payload
    }, globalConfig)
  }

  function update (id, attributes) {

    if (typeof id === 'object') {
      attributes = id
      id = undefined
    }

    let payload = {
      type,
      id,
      attributes
    }

    return endpoint({
      uri: uri(id),
      method: 'PATCH',
      payload
    }, globalConfig)
  }

  function del (id) {

    return endpoint({
      uri: uri(id),
      method: 'DELETE'
    }, globalConfig)
  }

  let initiateResource = function initiateResource () {

  }

  initiateResource[resourceName('get', type)] = getOne
  initiateResource[resourceName('create', type)] = create
  initiateResource[resourceName('update', type)] = update
  initiateResource[resourceName('delete', type)] = del

  // Create aliased, plural version of and endpoint
  // for a bulk request
  if (globalConfig.bulk === true) {
    initiateResource[resourceName('create', type, true)] = create
    initiateResource[resourceName('update', type, true)] = update
    initiateResource[resourceName('delete', type, true)] = del
  }

  if (!singleton) {
    initiateResource[resourceName('get', type, true)] = getAll
  }

  return initiateResource
}

export default resource
