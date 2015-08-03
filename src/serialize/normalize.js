// NOTE: see https://github.com/gaearon/normalizr

import camelCase from 'lodash/string/camelcase';

function normalizeResponse ({data, included}) {

  if (included) {

    included = included.reduce((result, resource) => {

      let type = camelCase(resource.type);

      resource.type = camelCase(resource.type);
      resource.attributes = normalizeAttributes(resource.attributes);
      resource.relationships = normalizeRelationships(resource.relationships);

      result[type] = result[type] || {};
      result[type][resource.id] = resource;

      return result;
    }, {});
  }

  return {
    data,
    included
  };
}

function normalizeAttributes (attributes) {

  return Object.keys(attributes).reduce((attrs, attrKey) => {

    attrs[camelCase(attrKey)] = attributes[attrKey];
    return attrs;
  }, {});
}

function normalizeRelationships (relationships) {

  return Object.keys(relationships).reduce((rels, typeName) => {

    rels[camelCase(typeName)] = normalizeRelationshipData(relationships[typeName]);
    return rels;
  }, {});
}

function normalizeRelationshipData (resource) {

  if (Array.isArray(resource.data)) {
    resource.data = resource.data.map(data => {

      data.type = camelCase(data.type);
      return data;
    });
  }
  else if (typeof resource.data === 'object' && resource.data !== null) {
    resource.data.type = camelCase(resource.data.type);
  }

  return resource;
}

export default {
  response: normalizeResponse
};
