function routeHandler(handler, params) {
  if (handler.components && handler.stores) {
    return handler;
  } else {
    return handler.apply(this, params);
  }
}

export default routeHandler;
