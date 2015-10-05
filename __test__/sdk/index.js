import {namespace} from 'tessed'
import mockFetch from 'mock-fetch'

import sdk from '../../src/sdk'

let test = namespace('sdk')

test.beforeEach(() => mockFetch.mock())
test.afterEach(() => mockFetch.restore())

test('instance', ({equal}) => {

  let api = sdk()
  equal(typeof api, 'function', 'is a function')
})

test('request', ({equal}) => {

  let api = sdk()

  return api()
    .getProjects()
      .then((res) => {

        let req = mockFetch.request()

        equal(req.method, 'GET', 'GET requests')
        equal(res.status, 200, 'successful request')
      })
})

test('default headers', ({deepEqual}) => {

  let api = sdk()

  deepEqual(api().config.headers, {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  }, 'configured headers')
})

test('custom headers', ({deepEqual}) => {

  let api = sdk({
    headers: {
      custom: 'header'
    }
  })

  deepEqual(api().config.headers, {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
    'custom': 'header'
  }, 'all headers')
})

test('custom instance headers', ({deepEqual}) => {

	let api = sdk({
	  headers: {
	    custom: 'header'
	  }
	})

	deepEqual(
		api({
			headers: {inst: 'header'}
		}).config.headers,
		{
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'custom': 'header',
			'inst': 'header'
		},
		'all headers'
	)
})

test('sets origin', ({equal}) => {

  let api = sdk({
    origin: 'http://api.com'
  })

  equal(api().config.origin, 'http://api.com', 'origin set')
})

test('api overwrites global configs', ({equal}) => {

  let api = sdk({
    origin: 'http://global.com'
  })

  equal(api().config.origin, 'http://global.com', 'global origin')

  let overridenApiConfig = api({
    origin: 'http://overridden.com'
  }).config

  equal(overridenApiConfig.origin, 'http://overridden.com', 'overridden origin')
})

test('bulk headers overwrite default headers', ({deepEqual}) => {

  let api = sdk()

  deepEqual(api().config.headers, {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  }, 'default headers')

  deepEqual(api().bulk().config.headers, {
    'Content-Type': 'application/vnd.api+json; ext=bulk',
    'Accept': 'application/vnd.api+json; ext=bulk'
  }, 'bulk headers')
})
