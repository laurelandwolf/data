import {capitalize, defaults, camelCase} from 'lodash';
import pluralize from 'pluralize';

import validate from './utils/validate';
import endpoint from './endpoint';

function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(pluralize(camelCase(type), plural ? 2 : 1))}`;
}

function resource (spec, globalConfig = {}) {

  let {type, singleton} = defaults(spec, {singleton: false});

  validate.type(type);

  function uri (id) {

    let u = `/${type}`;
    if (!singleton && id !== undefined) {
      u += `/${id}`;
    }

    return u;
  }

  // Get All
  function getAll () {

    return endpoint({
      uri: uri(),
      method: 'GET'
    }, globalConfig);
  }

  function getOne (id) {

    return endpoint({
      uri: uri(id),
      method: 'GET'
    }, globalConfig);
  }

  function create (attributes) {

    let payload = {
      type,
      attributes
    };

    return endpoint({
      uri: uri(),
      method: 'POST',
      payload
    }, globalConfig);
  }

  function update (id, attributes) {

    if (typeof id === 'object') {
      attributes = id;
      id = undefined;
    }

    let payload = {
      type,
      id,
      attributes
    };

    return endpoint({
      uri: uri(id),
      method: 'PATCH',
      payload
    }, globalConfig);
  }

  function del (id) {

    return endpoint({
      uri: uri(id),
      method: 'DELETE'
    }, globalConfig);
  }

  let routes = {
    [resourceName('get', type)]: getOne,
    [resourceName('create', type)]: create,
    [resourceName('update', type)]: update,
    [resourceName('delete', type)]: del
  };

  // Create aliased, plural version of and endpoint
  // for a bulk request
  if (globalConfig.bulk === true) {
    routes[resourceName('create', type, true)] = create;
    routes[resourceName('update', type, true)] = update;
    routes[resourceName('delete', type, true)] = del;
  }

  if (!singleton) {
    routes[resourceName('get', type, true)] = getAll;
  }

  return routes;
}

export default resource;
