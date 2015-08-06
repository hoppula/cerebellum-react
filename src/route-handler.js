function routeHandler(handler, params) {
  if (handler.components) {
    return handler;
  } else {
    return handler.apply(this, params);
  }
}

export default routeHandler;
