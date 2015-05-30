import 'native-promise-only';
import {
  createTitle,
  createProps,
  convertPropsToJS,
  renderNestedComponents
} from './helpers';

function createRender(React, options={}) {
  return function render(routeComponent, request) {
    const store = this.store;
    return new Promise((resolve, reject) => {

      const allStores = routeComponent.components.reduce((stores, component) => {
        return {...stores, ...component.stores.call(this, request)};
      }, {});

      return store.fetchAll(allStores).then((storeProps) => {
        if (options.convertProps) {
          storeProps = convertPropsToJS({...storeProps});
        }

        const propsList = routeComponent.stores.map((componentStores, i) => {
          const componentProps = Object.keys(componentStores.call(this, request)).reduce((result, storeId) => {
            result[storeId] = storeProps[storeId];
            return result;
          }, {});
          return createProps.call(this, routeComponent.components[i], componentProps, request);
        });

        // last child in components array defines the final page title
        const lastComponent = routeComponent.components[routeComponent.components.length - 1];
        const title = createTitle.call(this, lastComponent, {...storeProps}, request, options.prependTitle);

        const nestedRender = renderNestedComponents(React, routeComponent.components, propsList);

        const containerComponent = typeof options.containerComponent === "function"
          ? options.containerComponent.call(this, store, nestedRender)
          : nestedRender();

        document.getElementsByTagName("title")[0].innerHTML = title;

        return resolve(
          React.render(containerComponent, document.getElementById(options.appId))
        );
      }).catch(reject);
    });
  };
}

export default createRender;
