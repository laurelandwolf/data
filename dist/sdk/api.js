'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

var _request2 = require('./request');

var _request3 = _interopRequireDefault(_request2);

function api() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  function makeResource(options) {

    return (0, _resource2['default'])(options, config);
  }

  var projects = makeResource({
    type: 'projects'

    // TODO: this should be the name of the uri segement
    // If we need a custom uri segment with a different name
    // we should be able to define it
    // // optional
    // singular: 'project',
    // plural: 'projects',
    // uri: 'projects' <~~~~~~~~~~~ use that to override name
  });

  var designers = makeResource({
    type: 'designers'
  });

  var rooms = makeResource({
    type: 'rooms'
  });

  var floorPlans = makeResource({
    type: 'floor-plans'
  });

  var comments = makeResource({
    type: 'comments'
  });

  var photos = makeResource({
    type: 'photos'
  });

  var inspirationLinks = makeResource({
    type: 'inspiration-links'
  });

  var inspirationImages = makeResource({
    type: 'inspiration-images'
  });

  var furniture = makeResource({
    type: 'furniture'
  });

  var designPackageFloorPlans = makeResource({
    type: 'design-package-floor-plans'
  });

  var styleBoards = makeResource({
    type: 'style-boards'
  });

  var styleBoardTags = makeResource({
    type: 'style-board-tags'
  });

  var designPackageInstructions = makeResource({
    type: 'design-package-instructions'
  });

  var designPackages = makeResource({
    type: 'design-packages'
  });

  var portfolioImages = makeResource({
    type: 'portfolio-images'
  });

  var medias = makeResource({
    type: 'media'
  });

  var shoppinglistItems = makeResource({
    type: 'shopping-list-items'
  });

  var users = makeResource({
    type: 'users'
  });

  var shoppingCarts = makeResource({
    type: 'shopping-carts'
  });

  var shoppingCartItems = makeResource({
    type: 'shopping-cart-items'
  });

  var charges = makeResource({
    type: 'charges'
  });

  var invitations = makeResource({
    type: 'invitations'
  });

  var submissions = makeResource({
    type: 'submissions'
  });

  //// Singletons

  var recipient = makeResource({
    type: 'recipient',
    singleton: true
  });

  var card = makeResource({
    type: 'card',
    singleton: true
  });

  var bankAccount = makeResource({
    type: 'bank-account',
    singleton: true
  });

  var fetch = function fetch() {
    var _request;

    return (_request = (0, _request3['default'])(config)).fetch.apply(_request, arguments);
  };

  return (0, _lodash.assign)({ config: config },

  // Resources
  projects, designers, rooms, floorPlans, comments, photos, inspirationLinks, inspirationImages, furniture, designPackageFloorPlans, styleBoards, styleBoardTags, designPackageInstructions, designPackages, portfolioImages, medias, shoppinglistItems, users, shoppingCarts, shoppingCartItems, charges, invitations, submissions,

  // Singletons
  recipient, card, bankAccount, { fetch: fetch });
}

exports['default'] = api;
module.exports = exports['default'];