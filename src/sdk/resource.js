import {capitalize, defaults, camelCase} from 'lodash'
import pluralize from 'pluralize'
import {Observable} from 'rx-lite'

import validate from './utils/validate'
import endpoint from './endpoint'

// NOTE: this will be deprecated
function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(formattedType(type, plural))}`
}

function formattedType (type, plural = false) {

	return pluralize(camelCase(type), plural ? 2 : 1)
}

function streamingResource () {

}

function resource (spec, globalConfig = {}) {

  let {type, singleton} = defaults(spec, {singleton: false})
  let {streamSource, _stream} = globalConfig

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

  function resourceTypeName () {

  	if (spec.plural) {
  		return formattedType(spec.plural)
  	}

  	return formattedType(type, (!singleton || globalConfig.bulk === true))
  }

  function singularDashResourceTypeName (type) {


  }

  let routes = {
  	[resourceTypeName()]: function (/* TODO: options here */) {

  		// Observable interface
  		// TODO: Need to refactor this.
  		//       This is ugly! It should be it's own class
		  if (_stream) {
		  	return Observable.create(observer => {

		  		streamSource
		  			.filter(res => res.data.attributes.key === singularDashResourceTypeName(type))
		  			.forEach(observer.onNext)
		  	})
		  }

		  // HTTP interface
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
