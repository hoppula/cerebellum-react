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

export function reduceComponentStores(components) {
  return components.reduce((stores, component) => {
    return {...stores, ...component.stores};
  }, {});
}

export function reduceStatics(components, request, store) {

  function reduceActions(componentActions) {
    return Object.keys(componentActions).reduce((actions, storeId) => {
      actions[storeId] = componentActions[storeId].reduce((storeActions, action) => {
        return {
          ...storeActions,
          [action]: store.actions[storeId][action]
        };
      }, {});
      return actions;
    }, {});
  }

  return components.reduce((result, component) => {
    result.push({
      actions: reduceActions(
        typeof component.actions === "function"
        ? component.actions.call(this, request)
        : (component.actions || {})
      ),
      stores: (
        typeof component.stores === "function"
        ? component.stores.call(this, request)
        : (component.stores || {})
      )
    });
    return result;
  }, []);
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
