import {capitalize, defaults, camelCase} from 'lodash'
import pluralize from 'pluralize'

import validate from './utils/validate'
import endpoint from './endpoint'

function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(formattedType(type, plural))}`
}

function formattedType (type, plural = false) {

	return pluralize(camelCase(type), plural ? 2 : 1)
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

  function get (id, singleton = false) {

  	return (id !== undefined || singleton)
  		? getOne(id)
  		: getAll()
  }

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

  let resourceType = formattedType(type, (!singleton || globalConfig.bulk === true))
  let routes = {
  	[resourceType]: function (/* TODO: options here */) {

			return {
				get (id) {

					return get(id, singleton)
				},
				create,
				update,
				'delete': del
			}
  	}
  }

  routes[resourceName('get', type)] = getOne
  routes[resourceName('create', type)] = create
  routes[resourceName('update', type)] = update
  routes[resourceName('delete', type)] = del

  // Create aliased, plural version of and endpoint
  // for a bulk request
  if (globalConfig.bulk === true) {
    routes[resourceName('create', type, true)] = create
    routes[resourceName('update', type, true)] = update
    routes[resourceName('delete', type, true)] = del
  }

  if (!singleton) {
    routes[resourceName('get', type, true)] = getAll
  }

  return routes
}

export default resource
