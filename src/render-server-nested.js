import 'native-promise-only';
import {
  createTitle,
  createProps,
  convertPropsToJS,
  renderNestedComponents
} from './helpers';

function createRender(React, options={}) {
  return function render(document, routeComponent, request) {
    const store = this.store;
    return new Promise((resolve, reject) => {

      const allStores = routeComponent.components.reduce((stores, component) => {
        const componentStores = component.stores ? component.stores.call(this, request) : {};
        return {...stores, ...componentStores};
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

        document("title").html(title);
        document(`#${options.storeId}`).text(store.snapshot());
        document(`#${options.appId}`).html(
          React.renderToString(containerComponent)
        );

        return resolve(document.html());
      }).catch(reject);
    });
  };
}

export default createRender;

