import {omit, pick, get as _get} from 'lodash'
import joinPath from 'join-path'

function request (spec = {}) {

  if (window == null) {
    global.window = global
  }

  if (!window.Promise) {
    throw new Error('window.Promise not supported. Please provide a polyfill.')
  }

  if (!window.fetch) {
    throw new Error('window.fetch not supported. Please provide a polyfill.')
  }

  let origin = spec.origin || ''
  let defaultMethod = 'GET'

  // Options that are used for every request
  let fetchConfig = omit(spec, 'origin', 'fetch')

  function httpRequest (url, options) {

    return new window.Promise((resolve, reject) => {

      // Latest custom fetch options
      if (options) {
        fetchConfig = {...fetchConfig, ...options}
      }

      fetchConfig = {...{method: defaultMethod}, ...fetchConfig}

      window.fetch(joinPath(origin, url), fetchConfig)
        .then((response) => {

          // NOTE: there is no body on a 204 response,
          //       so there will be nothing to parse

          if (response.status === 204) {
            resolve({
              status: response.status,
              headers: response.headers
            })
          }
          else {

            // TODO: check res.headers.get('Content-Type') to see
            //       if json should even be parsed
            let contentType = 'json'
            let contentTypeGetter = _get(response, 'headers.get')
            if (contentTypeGetter) {
              contentType = response.headers.get('content-type').indexOf('vnd.api+json') > -1 ? 'json' : 'text'
            }
            response[contentType]().then((body) => {

              if (response.status < 400) {
                resolve({
                  status: response.status,
                  headers: response.headers,
                  body
                })
              }
              else {
                let responseObject = {...pick(response, 'status', 'statusText'), body}
                reject(responseObject)
              }
            })
          }

        })
    })
  }

  function get (url) {

    return httpRequest(url, {
      method: 'GET'
    })
  }

  function post (url, payload = {}) {

    return httpRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  function put (url, payload = {}) {

    return httpRequest(url, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
  }

  function patch (url, payload = {}) {

    return httpRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  function del (url) {

    return httpRequest(url, {
      method: 'DELETE'
    })
  }

  return {
    fetch: httpRequest,
    get,
    post,
    put,
    patch,
    'delete': del
  }
}

export default request
