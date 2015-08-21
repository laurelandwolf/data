// NOTE: see https://github.com/gaearon/react-redux/blob/master/src%2Fcomponents%2FcreateConnector.js#L85

// function connect (store) {

//   if (typeof store === 'function') {
//     // get store form context
//     let selector = store;
//   }
//   else {
//     return function select (selector) {

//       let selectedState = selector(store.getState());

//       return function (Component) {

//         return Component;
//       };
//     };
//   }
// }

// export default connect;
