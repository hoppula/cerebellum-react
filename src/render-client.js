require('native-promise-only');
var helpers = require('./helpers');

function createRender(React, options) {
  options = options || {};

  return function render(component, request) {
    var self = this;
    var componentFactory = React.createFactory(component);
    var store = this.store;
    return new Promise(function(resolve, reject) {
      return store.fetchAll(component.stores.call(self, request)).then(function(storeProps) {
        if (options.convertProps) {
          storeProps = helpers.convertPropsToJS(storeProps);
        }
        var props = helpers.createProps.call(self, component, storeProps, request);
        var title = helpers.createTitle.call(self, component, storeProps, request, options.prependTitle);

        var containerComponent = typeof options.containerComponent === "function"
          ? options.containerComponent.call(self, store, componentFactory, props)
          : componentFactory(props);

        document.getElementsByTagName("title")[0].innerHTML = title;

        return resolve(
          React.render(containerComponent, document.getElementById(options.appId))
        );

      }).catch(reject);
    });
  };
}

module.exports = createRender;
