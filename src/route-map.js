import flattenDeep from 'lodash/array/flattenDeep';

function componentRoutes(routes, baseUrl="", parentComponents=[]) {
  return Object.keys(routes).reduce((result, route) => {
    const component = routes[route];
    const components = parentComponents.concat(component);
    const url = `${baseUrl}${route}`;

    result.push({
      url: url,
      components: components
    });

    if (component.routes) {
      return result.concat(
        componentRoutes(component.routes, url, components)
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
      stores: route.components.map(component => component.stores || {})
    };
    return routeMap;
  }, {});
}

export default generateRouteMap;
