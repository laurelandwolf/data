import {namespace} from 'tessed'

import {sdk, serialize} from '../src'
import serializeDirect from '../src/serialize'
import sdkDirect from '../src/sdk'

let test = namespace('root exports')

test('root', ({deepEqual}) => {

  deepEqual(sdk, sdkDirect, 'sdk')
  deepEqual(serialize, serializeDirect, 'serialize')
})






// let api = sdk({
// 	stream: {
// 		PUSHER_APP_KEY
// 	}
// })

// api()
// 	.stream() // TODO: throw error if "stream" option is not set in instantiation of sdk
// 	.comments()
// 	.created()
// 	.subscribe()

// api()
// 	.bulk()
// 	.comments()
// 	.create()
// 	.then()
