require('native-promise-only');
var helpers = require('./helpers');

function createRender(React, options) {
  options = options || {};

  return function render(document, component, request) {
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

        document("title").html(title);
        document("#" + options.storeId).text(store.snapshot());
        document("#" + options.appId).html(
          React.renderToString(containerComponent)
        );

        return resolve(document.html());

      }).catch(reject);
    });
  };
}

module.exports = createRender;
