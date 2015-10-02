import {capitalize, defaults, camelCase} from 'lodash'
import pluralize from 'pluralize'

import pipe from 'ramda/src/pipe'
import prop from 'ramda/src/prop'

import endpoint from './endpoint'
import validate from './utils/validate'
import streamUtils from './utils/stream'

// NOTE: this will be deprecated
function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(formattedType(type, plural))}`
}

function formattedType (type, plural = false) {

	return pluralize(camelCase(type), plural ? 2 : 1)
}

function resource (spec, globalConfig = {}) {

  let {type, singleton} = defaults(spec, {singleton: false})

  validate.type(type)

  let {getStream} = globalConfig

  function uri (id) {

    let u = `/${type}`
    if (!singleton && id !== undefined) {
      u += `/${id}`
    }

    return u
  }

  function get (id, isSingleton = false) {

  	return (id !== undefined || isSingleton)
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

  function update (id, attrs) {

  	let attributes = attrs

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

  function streamEvents (action) {

  	return getStream()
  		.filter(pipe(prop('key'), streamUtils.matchesEventKey(type)))
  		.filter(pipe(prop('key'), streamUtils.matchesEventAction(action)))
  		.map(prop('body'))
  }

  function resourceTypeName () {

  	if (spec.plural) {
  		return formattedType(spec.plural)
  	}

  	return formattedType(type, (!singleton || globalConfig.bulk === true))
  }

  let routes = {
  	[resourceTypeName()]: function (/* TODO: options here */) {

		  // HTTP interface
			return {
				get: (id) => get(id, singleton),
				create,
				update,
				'delete': del,
				stream: streamEvents
			}
  	}
  }

  // NOTE: these will be deprecated
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
