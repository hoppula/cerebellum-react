import createRender from './render';
import routeHandler from './route-handler';
import routeMap from './route-map';

export default function CerebellumReact(Cerebellum, React, opts={}, context={}) {
  const options = {...opts};
  options.routeHandler = routeHandler;
  options.routes = routeMap(opts.routes);
  options.render = createRender(React, {
    appId: options.appId,
    prependTitle: options.prependTitle,
    containerComponent: options.containerComponent
  });

  return Cerebellum(options, context);
}
