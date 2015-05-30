// don't invoke route handler directly if it provides title & stores as properties / functions
// this is an optimization to keep routes pretty,
// e.g. "/posts/:id": PostComponent

// TODO: merge with route-handler.js

function routeHandler(handler, params) {
  if (handler.components && handler.stores) {
    return handler;
  } else {
    return handler.apply(this, params);
  }
}

export default routeHandler;
