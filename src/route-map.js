import flattenDeep from 'lodash/array/flattenDeep';

function componentRoutes(routes, baseUrl="", parentComponents=[], parentStores=[]) {
  return Object.keys(routes).reduce((result, route) => {
    const component = routes[route];
    const components = parentComponents.concat(component);
    const stores = parentStores.concat(component.stores);
    const url = `${baseUrl}${route}`;

    result.push({
      url: url,
      components: components,
      stores: stores
    });

    if (component.routes) {
      return result.concat(
        componentRoutes(component.routes, url, components, stores)
      );
    } else {
      return result;
    }
  }, []);
}

function generateRouteMap(routes={}) {
  return flattenDeep(componentRoutes(routes)).reduce((routeMap, route) => {
    routeMap[route.url] = {
      components: route.components,
      stores: route.stores
    };
    return routeMap;
  }, {});
}

export default generateRouteMap;
