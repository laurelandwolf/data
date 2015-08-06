import isEmpty from 'lodash/lang/isempty';
import {merge} from 'lodash';
import raf from 'raf';

import request from '../request';
import qshash from './qs-hash';
import qslist from './qs-list';
import querySerializer from './query-serializer';
import formatRequestRelationships from '../utils/format-request-relationships';

function endpoint ({uri = '/', method = 'GET', payload} = {}, apiConfig) {

  let req = request(apiConfig);
  let includes = qslist('include');
  let sort = qslist('sort');
  let fields = qshash();
  let query = querySerializer();

  function renderEndpointUri () {

    let querystring = [];

    if (includes.count() > 0) {
      querystring.push(includes.stringify());
    }

    if (fields.count() > 0) {
      querystring.push(fields.stringify());
    }

    //
    if (sort.count() > 0) {
      querystring.push(sort.stringify());
    }

    if (query.count() > 0) {
      querystring.push(query.stringify());
    }

    // Ensure that nothing extra gets put in the uri
    if (querystring.length > 0) {
      uri += `?${querystring.join('&')}`;
    }

    return uri;
  }

  // TODO: move this so it's only available to the requests that need it
  let relationships = {};

  let promise = new Promise((resolve, reject) => {

    raf(() => {

      let requestUri = renderEndpointUri();
      let payloadBody = {};

      // Get relationships in there!
      if (!isEmpty(relationships)) {
        payloadBody = merge(payload || {}, {relationships});
      }

      // Serialize request
      if (!isEmpty(payload)) {
        payloadBody = payload.relationships ? {
          ...payload,
          relationships: formatRequestRelationships(payload.relationships)
        } : payload;
      }

      req[method.toLowerCase()](requestUri, {
        data: payloadBody
      })
        .then(resolve)
        .catch(reject);
    });
  });

  // Chainable methods for get requests
  if (method.toLowerCase() === 'get') {
    promise.include = (...args) => {

      includes.push(...args);
      return promise;
    };

    promise.fields = (...args) => {

      fields.add(...args);
      return promise;
    };

    promise.sort = (...args) => {

      sort.push(...args);
      return promise;
    };

    promise.query = (...args) => {

      query.add(...args);
      return promise;
    };
  }

  // Chainable methods for post requests
  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'patch') {
    promise.relatedTo = (rels) => {

      relationships = merge(relationships, rels);
      return promise;
    };

    promise.include = (...args) => {

      includes.push(...args);
      return promise;
    };
  }

  return promise;
}

export default endpoint;
