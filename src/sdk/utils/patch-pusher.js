/*global Pusher, ActiveXObject*/

import curry from 'ramda/src/curry'

export default curry(function (contentTypeheader, acceptHeader, socketId, callback) {

	let self = this
	let xhr

	if (Pusher.XHR) {
		xhr = new Pusher.XHR()
	}
	else {
		xhr = (window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'))
	}

	xhr.open('POST', self.options.authEndpoint, true)

	// add request headers
	xhr.setRequestHeader('Content-Type', `${contentTypeheader}; ext=pusher-authentication`)
	xhr.setRequestHeader('Accept', `${acceptHeader}; ext=pusher-authentication`)
	for (let headerName in this.authOptions.headers) {
		xhr.setRequestHeader(headerName, this.authOptions.headers[headerName])
	}

	xhr.onreadystatechange = () => {

		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let data
				let parsed = false

				try {
					data = JSON.parse(xhr.responseText)
					parsed = true
				}
				catch (e) {
					callback(true, `JSON returned from webapp was invalid, yet status code was 200. Data was: ${xhr.responseText}`)
				}

				if (parsed) { // prevents double execution.
					callback(false, data)
				}
			}
			else {
				Pusher.warn('Couldn\'t get auth info from your webapp', xhr.status)
				callback(true, xhr.status)
			}
		}
	}

	xhr.send(this.composeQuery(socketId))

	return xhr
})
