import 'native-promise-only';
import Document from './document';
import {
  convertPropsToJS,
  createProps,
  createTitle,
  reduceComponentStores,
  reduceStatics,
  renderNestedComponents
} from './helpers';

function createRender(React, options={}) {
  return function render(doc, routeComponent, request) {
    const document = new Document({
      document: doc,
      appId: options.appId,
      storeId: options.storeId
    });

    // `this` is current render context
    const API = this.api;
    const store = this.store;
    const lastComponent = routeComponent.components[routeComponent.components.length - 1];
    const statics = reduceStatics(routeComponent.components, request, store);

    return new Promise((resolve, reject) => {
      return API.fetchAll(
        reduceComponentStores.call(this, statics)
      ).then((storeProps) => {
        // should all props be converted from Immutable to plain JS
        if (options.convertProps) {
          storeProps = convertPropsToJS({...storeProps});
        }

        const propsList = statics.map((component, i) => {
          const componentProps = Object.keys(component.stores).reduce((result, storeId) => {
            result[storeId] = storeProps[storeId];
            return result;
          }, {});

          componentProps.actions = component.actions;

          return createProps.call(this, routeComponent.components[i], componentProps, request);
        });

        // last child in components array defines the final page title
        const title = createTitle.call(this, lastComponent, {...storeProps}, request, options.prependTitle);

        const nestedRender = renderNestedComponents(React, routeComponent.components, propsList);
        const containerComponent = typeof options.containerComponent === "function"
          ? options.containerComponent.call(this, store, nestedRender)
          : nestedRender();

        document.title = title;
        document.snapshot = store.snapshot();

        return resolve(
          document.render(React, containerComponent)
        );

      }).catch(reject);
    });
  };
}

export default createRender;
