import {assign} from 'lodash';

import resource from './resource';
import request from './request';

function api (config = {}) {

  function makeResource (options) {

    return resource(options, config);
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
  });

  let designers = makeResource({
    type: 'designers'
  });

  let rooms = makeResource({
    type: 'rooms'
  });

  let floorPlans = makeResource({
    type: 'floor-plans'
  });

  let comments = makeResource({
    type: 'comments'
  });

  let photos = makeResource({
    type: 'photos'
  });

  let inspirationLinks = makeResource({
    type: 'inspiration-links'
  });

  let inspirationImages = makeResource({
    type: 'inspiration-images'
  });

  let furniture = makeResource({
    type: 'furniture'
  });

  let designPackageFloorPlans = makeResource({
    type: 'design-package-floor-plans'
  });

  let styleBoards = makeResource({
    type: 'style-boards'
  });

  let styleBoardTags = makeResource({
    type: 'style-board-tags'
  });

  let designPackageInstructions = makeResource({
    type: 'design-package-instructions'
  });

  let designPackages = makeResource({
    type: 'design-packages'
  });

  let portfolioImages = makeResource({
    type: 'portfolio-images'
  });

  let medias = makeResource({
    type: 'media'
  });

  let shoppinglistItems = makeResource({
    type: 'shopping-list-items'
  });

  let users = makeResource({
    type: 'users'
  });

  let shoppingCarts = makeResource({
    type: 'shopping-carts'
  });

  let shoppingCartItems = makeResource({
    type: 'shopping-cart-items'
  });

  let charges = makeResource({
    type: 'charges'
  });

  let invitations = makeResource({
    type: 'invitations'
  });

  let submissions = makeResource({
    type: 'submissions'
  });

  //// Singletons

  let recipient = makeResource({
    type: 'recipient',
    singleton: true
  });

  let card = makeResource({
    type: 'card',
    singleton: true
  });

  let bankAccount = makeResource({
    type: 'bank-account',
    singleton: true
  });

  let fetch = function (...args) {

    return request(config).fetch(...args);
  };

  return assign(
    {config},

    // Resources
    projects,
    designers,
    rooms,
    floorPlans,
    comments,
    photos,
    inspirationLinks,
    inspirationImages,
    furniture,
    designPackageFloorPlans,
    styleBoards,
    styleBoardTags,
    designPackageInstructions,
    designPackages,
    portfolioImages,
    medias,
    shoppinglistItems,
    users,
    shoppingCarts,
    shoppingCartItems,
    charges,
    invitations,
    submissions,

    // Singletons
    recipient,
    card,
    bankAccount,
    {fetch}
  );
}

export default api;
