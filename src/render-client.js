import 'native-promise-only';
import {
  createTitle,
  createProps,
  convertPropsToJS
} from './helpers';

function createRender(React, options={}) {
  return function render(component, request) {
    const componentFactory = React.createFactory(component);
    const store = this.store;
    return new Promise((resolve, reject) => {
      return store.fetchAll(component.stores.call(this, request)).then((storeProps) => {
        if (options.convertProps) {
          storeProps = convertPropsToJS(storeProps);
        }
        const props = createProps.call(this, component, storeProps, request);
        const title = createTitle.call(this, component, storeProps, request, options.prependTitle);

        const containerComponent = typeof options.containerComponent === "function"
          ? options.containerComponent.call(this, store, componentFactory, props)
          : componentFactory(props);

        document.getElementsByTagName("title")[0].innerHTML = title;

        return resolve(
          React.render(containerComponent, document.getElementById(options.appId))
        );
      }).catch(reject);
    });
  };
}

export default createRender;
