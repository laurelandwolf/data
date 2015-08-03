import asArray from 'as-array';
import merge from 'merge';

import {camelCase} from './format';

function formatRelationshipData (resource, formatter = camelCase) {

  if (Array.isArray(resource.data)) {
    resource.data = resource.data.map(data => {

      return {
        ...data,
        type: formatter(data.type)
      };
    });
  }
  else if (typeof resource.data === 'object' && resource.data !== null) {
    resource.data.type = formatter(resource.data.type);
  }

  return resource;
}

function formatRelationships (relationships, formatter = camelCase) {

  return Object.keys(relationships).reduce((rels, typeName) => {

    rels[formatter(typeName)] = formatRelationshipData(relationships[typeName], formatter);
    return rels;
  }, {});
}

function formatAttributes (attributes, formatter = camelCase) {

  return Object.keys(attributes).reduce((attrs, attrKey) => {

    attrs[formatter(attrKey)] = attributes[attrKey];
    return attrs;
  }, {});
}

function formatResources (included, formatter = camelCase) {

  if (!included) {
    return included;
  }

  return included.reduce((result, resource) => {

    let type = formatter(resource.type);

    result[type] = {
      ...result[type],

      [resource.id]: {
        ...resource,
        type: formatter(resource.type),
        attributes: formatAttributes(resource.attributes, formatter),
        relationships: formatRelationships(resource.relationships, formatter)
      }
    };

    return result;
  }, {});
}

function response ({data, included}, formatter = camelCase) {

  return {
    ...formatResources(included),
    ...formatResources(asArray(data))
  };
}

export default {
  response
};
