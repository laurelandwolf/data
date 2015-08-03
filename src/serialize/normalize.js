import camelCase from 'lodash/string/camelcase';

function format ({data, included}, formatter = camelCase) {

  if (included) {

    included = included.reduce((result, resource) => {

      let type = formatter(resource.type);

      resource.type = formatter(resource.type);
      resource.attributes = formatAttributes(resource.attributes);
      resource.relationships = formatRelationships(resource.relationships);

      result[type] = result[type] || {};
      result[type][resource.id] = resource;

      return result;
    }, {});
  }

  return {
    data: {
      ...data,
      type: formatter(data.type),
      attributes: formatAttributes(data.attributes),
      relationships: formatRelationships(data.relationships)
    },
    included
  };
}

function formatAttributes (attributes, formatter = camelCase) {

  return Object.keys(attributes).reduce((attrs, attrKey) => {

    attrs[formatter(attrKey)] = attributes[attrKey];
    return attrs;
  }, {});
}

function formatRelationships (relationships, formatter = camelCase) {

  return Object.keys(relationships).reduce((rels, typeName) => {

    rels[formatter(typeName)] = formatRelationshipData(relationships[typeName]);
    return rels;
  }, {});
}

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

export default {
  format
};
