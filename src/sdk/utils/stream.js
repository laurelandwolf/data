import pluralize from 'pluralize'

import pipe from 'ramda/src/pipe'
import equals from 'ramda/src/equals'
import head from 'ramda/src/head'
import split from 'ramda/src/split'
import prop from 'ramda/src/prop'
import drop from 'ramda/src/drop'
import T from 'ramda/src/T'

import {format, normalize} from '../../serialize'

function matchesEventAction (action) {

	if (action === undefined) {
		return T
	}

	return pipe(
		split('.'),
		drop(1),
		format.camelCase,
		equals(action)
	)
}

function matchesEventKey (type) {

	return pipe(
		split('.'),
		head,
		format.camelCase,
		equals(singularDashResourceTypeName(type))
	)
}

function singularDashResourceTypeName (type) {

	return pluralize(format.camelCase(type), 1)
}

export default {
	matchesEventAction,
	matchesEventKey
}


