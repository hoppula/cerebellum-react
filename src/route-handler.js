// don't invoke route handler directly if it provides title & stores as properties / functions
// this is an optimization to keep routes pretty,
// e.g. "/posts/:id": PostComponent

function routeHandler(handler, params) {
  if (handler.title && handler.stores) {
    return handler;
  } else {
    return handler.apply(this, params);
  }
}

module.exports = routeHandler;
