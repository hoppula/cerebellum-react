module.exports.createTitle = function createTitle(component, storeProps, request, prependTitle) {
  var title;
  if (typeof component.title === "function") {
    title = component.title(storeProps, request);
  } else {
    title = component.title;
  }

  if (prependTitle) {
    title = prependTitle + title;
  }

  return title;
};

module.exports.createProps = function createProps(component, storeProps, request) {
  if (component.preprocess === "function") {
    return component.preprocess(storeProps, request);
  } else {
    return storeProps;
  }
};
