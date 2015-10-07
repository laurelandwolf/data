import Pusher from './pusher'

function connect (config) {

	let {auth, user} = config

	let pusher = new Pusher(auth.key, {
    authEndpoint: auth.endpoint,
    auth: {
      headers: {
        'X-Entity': user.type,
        'Authorization': generateAuthHeader(user.id, user.token)
      }
    }
  })

  let channel = pusher.subscribe(`private-${user.type.toLowerCase()}@${user.id}`)

  function subscribe (fn) {

  	channel.bind_all(fn)
  }

	return {
		subscribe
	}
}

// TODO: pull this out into it's own module
function generateAuthHeader (id, token) {

	return `Basic ${btoa([id, token].join(':'))}`
}

export default {
	connect
}
