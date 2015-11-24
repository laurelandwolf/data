import {reduce, map, isEmpty} from 'lodash'
import asArray from 'as-array'

import {camelCase, dashCase} from './format'

function formatRelationshipData (resource, formatter = camelCase) {

  if (Array.isArray(resource.data)) {
    resource.data = map(resource.data, data => {

      return {
        ...data,
        type: formatter(data.type)
      }
    })
  }
  else if (typeof resource.data === 'object' && resource.data !== null) {
    resource.data.type = formatter(resource.data.type)
  }

  return resource
}

function formatRelationships (relationships, formatter = camelCase) {

  let result = reduce(relationships, (rels, value, typeName) => {

    rels[formatter(typeName)] = formatRelationshipData(value, formatter)
    return rels
  }, {})

  return isEmpty(result) ? undefined : result
}

function formatAttributes (attributes, formatter = camelCase) {

  let result = reduce(attributes, (attrs, value, attrKey) => {

    attrs[formatter(attrKey)] = value
    return attrs
  }, {})

  return isEmpty(result) ? undefined : result
}

function formatResources (included, formatter = camelCase) {

  if (!included) {
    return included
  }

  return reduce(included, (result, resource) => {

    let type = formatter(resource.type)

    result[type] = {
      ...result[type],

      [resource.id]: {
        ...resource,
        type: formatter(resource.type),
        attributes: formatAttributes(resource.attributes, formatter),
        relationships: formatRelationships(resource.relationships, formatter)
      }
    }

    return result
  }, {})
}

function formatResourceRequest (data, formatter = dashCase) {

  if (!data) {
    return data
  }

  return {
    ...data,
    type: formatter(data.type),
    attributes: formatAttributes(data.attributes, formatter),
    relationships: formatRelationships(data.relationships, formatter)
  }
}

function normalizeResponse ({data, included}, formatter = camelCase) {

  return {
    ...formatResources(asArray(data), formatter),
    ...formatResources(included, formatter)
  }
}

function normalizeRequest (body, formatter = dashCase) {

  let data = Array.isArray(body.data)
    ? map(body.data, resource => formatResourceRequest(resource, formatter))
    : formatResourceRequest(body.data, formatter)

  return {
    ...body,
    data
  }
}

export default {
  response: normalizeResponse,
  request: normalizeRequest
}
