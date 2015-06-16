export function convertPropsToJS(props) {
  return Object.keys(props).reduce(function(obj, key) {
    obj[key] = props[key].toJS();
    return obj;
  }, {});
}

export function createProps(component, storeProps, request) {
  if (typeof component.preprocess === "function") {
    return component.preprocess.call(this, storeProps, request);
  } else {
    return storeProps;
  }
}

export function createTitle(component, storeProps, request, prependTitle) {
  let title = typeof component.title === "function"
    ? component.title.call(this, storeProps, request)
    : component.title;

  if (prependTitle) {
    title = `${prependTitle}${title}`;
  }

  return title;
}

export function reduceComponentStores(components, request) {
  return components.reduce((stores, component) => {
    const componentStores = typeof component.stores === "function"
      ? component.stores.call(this, request)
      : {};
    return {...stores, ...componentStores};
  }, {});
}

// TODO: clean
export function renderNestedComponents(React, components, props) {
  return function() {
    return components.reduce((previousComponent, component, i) => {
      const componentFactory = React.createFactory(component);
      if (i === 0) {
        return (components.length === 1)
          ? componentFactory(props[0])
          : componentFactory;
      } else {
        const child = i === (components.length - 1)
          ? componentFactory(props[i])
          : componentFactory;
        return previousComponent(props[i - 1], child);
      }
    }, null);
  };
}
