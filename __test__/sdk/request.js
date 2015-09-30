import {namespace} from 'tessed'
import mockFetch from 'mock-fetch'

import request from '../../src/sdk/request'

const ORIGIN = 'https://api.laurelandwolf.com/v1.0'
let test = namespace('request')

test.beforeEach(() => {

  mockFetch.mock({
    response: {
      headers: {
        custom: 'header'
      }
    }
  })
})

test.afterEach(() => mockFetch.restore())

test('custom origin', ({equal}) => {

  return request({
    origin: ORIGIN
  }).get('/test')
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, ORIGIN + '/test', 'url with origin')
    })
})

test('normalizes path when combining origin and request url', ({equal}) => {

  return request({
    origin: 'https://api.laurelandwolf.com/v1.0/'
  }).get('/test')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, 'https://api.laurelandwolf.com/v1.0/test', 'normalized path')
    })
})

test('custom headers', ({deepEqual}) => {

  return request({
    headers: {
      custom : 'header'
    }
  }).get('/test')
    .then((res) => {

      let req = mockFetch.request()

      deepEqual(req.headers, {
        custom: 'header'
      }, 'headers set')
    })
})

test('bare fetch', ({equal, deepEqual}) => {

  return request().fetch('/test', {
    method: 'GET',
    headers: {
      custom : 'header'
    }
  })
    .then((res) => {

      let req = mockFetch.request()

      equal(req.method, 'GET', 'method')
      deepEqual(req.headers, {
        custom: 'header'
      }, 'headers')
    })
}); // NOTE: this semicolon is needed for some reason????

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {

  test(method, ({equal}) => {

    let req = request()

    return req[method.toLowerCase()]('/test')
      .then((res) => {

        let req = mockFetch.request()
        equal(req.method, method, method + ' method')
      })
  })
})

test('status', ({equal}) => {

    return request().get().then((res) => {

      equal(res.status, 200, '200 status')
    })
})

test('headers', ({deepEqual}) => {

  return request().get().then((res) => {

    deepEqual(res.headers, {
      custom: 'header'
    }, 'custom headers')
  })
})
