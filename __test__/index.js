import {namespace} from 'tessed'

import {sdk, serialize} from '../src'
import serializeDirect from '../src/serialize'
import sdkDirect from '../src/sdk'

let test = namespace('sdk')
test.streaming = namespace('streaming')

test('root', ({deepEqual}) => {

  deepEqual(sdk, sdkDirect, 'sdk')
  deepEqual(serialize, serializeDirect, 'serialize')
})

test.streaming.only('subscribe to all', ({plan}) => {

	plan(1)

	let api = sdk({
		streaming: {

		}
	})

	return done => {

		let comments = api()
			.stream()
			.comments()
			// .filter()
			// .map()
			// .forEach()

		let sub = comments.subscribe(val => {

			done()
		})
	}
})
