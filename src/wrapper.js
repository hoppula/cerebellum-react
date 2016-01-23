import createRender from './render';
import routeHandler from './route-handler';
import routeMap from './route-map';

export default function CerebellumReact(Cerebellum, React, ReactDOM, opts={}, context={}) {
  const options = {...opts};
  options.routeHandler = routeHandler;
  options.routes = routeMap(opts.routes);
  options.render = createRender(React, ReactDOM, {
    appId: options.appId,
    prependTitle: options.prependTitle,
    storeId: options.storeId,
    containerComponent: options.containerComponent,
    convertProps: options.convertProps
  });

  return Cerebellum(options, context);
}
