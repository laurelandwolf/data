import Pusher from 'pusher-js'

import patchPusher from './patch-pusher'
import {DEFAULT_HEADERS} from '../sdk/headers'

// Monkey patch pusher auth to use our endpoint
Pusher.authorizers.ajax = patchPusher(
	Pusher,
	DEFAULT_HEADERS['Content-Type'],
	DEFAULT_HEADERS.Accept
)

export default Pusher
