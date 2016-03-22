import resource from './resource'
import request from './request'
import {BULK_HEADERS} from './headers'

function api (config = {}) {

  function makeResource (options) {

    return resource(options, config)
  }

  let projects = makeResource({
    type: 'projects'

    // TODO: this should be the name of the uri segement
    // If we need a custom uri segment with a different name
    // we should be able to define it
    // // optional
    // singular: 'project',
    // plural: 'projects',
    // uri: 'projects' <~~~~~~~~~~~ use that to override name
  })

  let designers = makeResource({
    type: 'designers'
  })

  let ratings = makeResource({
    type: 'ratings'
  })

  let rooms = makeResource({
    type: 'rooms'
  })

  let floorPlans = makeResource({
    type: 'floor-plans'
  })

  let comments = makeResource({
    type: 'comments'
  })

  let photos = makeResource({
    type: 'photos'
  })

  let inspirationLinks = makeResource({
    type: 'inspiration-links'
  })

  let inspirationImages = makeResource({
    type: 'inspiration-images'
  })

  let furniture = makeResource({
    type: 'furniture'
  })

  let designPackageFloorPlans = makeResource({
    type: 'design-package-floor-plans'
  })

  let styleBoards = makeResource({
    type: 'style-boards'
  })

  let styleBoardTags = makeResource({
    type: 'style-board-tags'
  })

  let designPackageInstructions = makeResource({
    type: 'design-package-instructions'
  })

  let designPackages = makeResource({
    type: 'design-packages'
  })

  let portfolioImages = makeResource({
    type: 'portfolio-images'
  })

  let medias = makeResource({
    type: 'media'
  })

  let shoppinglistItems = makeResource({
    type: 'shopping-list-items'
  })

  let users = makeResource({
    type: 'users'
  })

  let shoppingCarts = makeResource({
    type: 'shopping-carts'
  })

  let shoppingCartItems = makeResource({
    type: 'shopping-cart-items'
  })

  let charges = makeResource({
    type: 'charges'
  })

  let invitations = makeResource({
    type: 'invitations'
  })

  let submissions = makeResource({
    type: 'submissions'
  })

  let submissionStyleBoards = makeResource({
    type: 'submission-style-boards'
  })

  let submissionStyleBoardTags = makeResource({
    type: 'submission-style-board-tags'
  })

  let submissionStyleBoardTagPlacements = makeResource({
    type: 'submission-style-board-tag-placements'
  })

  let feedback = makeResource({
  	type: 'feedback',
  	plural: 'feedback'
  })

  let activities = makeResource({
  	type: 'activities'
  })

  let quizzes = makeResource({
    type: 'quizzes'
  })

  let quizResults = makeResource({
    type: 'quiz-results'
  })

  let quizVotes = makeResource({
    type: 'quiz-votes'
  })

  let authorizations = makeResource({
    type: 'authorizations'
  })

  let adminNotifications = makeResource({
    type: 'admin-notifications'
  })

  let purchaseRequestInvoices = makeResource({
    type: 'purchase-request-invoices'
  })

  //// Singletons

  let recipient = makeResource({
    type: 'recipient',
    singleton: true
  })

  let card = makeResource({
    type: 'card',
    singleton: true
  })

  let bankAccount = makeResource({
    type: 'bank-account',
    singleton: true
  })

  function fetch (...args) {

    return request(config).fetch(...args)
  }

  function bulk () {

    return api({
      ...config,
      headers: {
        ...(config.headers || {}),
        ...BULK_HEADERS
      },
      bulk: true
    })
  }

  function stream () {

  	if (!config.streaming) {
  		throw new Error('A stream config object must be provided to use the streaming api')
  	}

  	return api({
  		...config,
  		_stream: true
  	})
  }

  return {
    config,
    fetch,
    bulk,
    stream,

    // Resources
    ...activities,
    ...adminNotifications,
    ...authorizations,
    ...charges,
    ...comments,
    ...designers,
    ...designPackageFloorPlans,
    ...designPackageInstructions,
    ...designPackages,
    ...feedback,
    ...floorPlans,
    ...furniture,
    ...inspirationImages,
    ...inspirationLinks,
    ...invitations,
    ...medias,
    ...photos,
    ...portfolioImages,
    ...projects,
    ...purchaseRequestInvoices,
    ...quizResults,
    ...quizVotes,
    ...quizzes,
    ...ratings,
    ...rooms,
    ...shoppingCartItems,
    ...shoppingCarts,
    ...shoppinglistItems,
    ...styleBoards,
    ...styleBoardTags,
    ...submissions,
    ...submissionStyleBoards,
    ...submissionStyleBoardTagPlacements,
    ...submissionStyleBoardTags,
    ...users,

    // Singletons
    ...card,
    ...recipient,
    ...bankAccount
  }
}

export default api
