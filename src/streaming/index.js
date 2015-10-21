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
  let subscriptions = []

	channel.bind_all((...args) => subscriptions.forEach(sub => sub(...args)))

	return {
		subscribe (fn) {

      subscriptions.push(fn)
    }
	}
}

// TODO: pull this out into it's own module
function generateAuthHeader (id, token) {

	return `Basic ${btoa([id, token].join(':'))}`
}

export default {
	connect
}
