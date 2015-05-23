# Cerebellum React helpers

This package contains `render-client` and `render-server` methods that you can use to create suitable cerebellum render methods for React.

## Component static methods

render-client & render-server bring some really useful static methods for your route components.

### Component.title(storeProps, request)

With `.title` You can provide title for your route component. Can be either function or static string.

### Component.stores(request)

With `.stores` you can define what stores cerebellum will fetch when entering your route.

```javascript
LinksIndex.stores = (request) => {
  return {
    "user": {},
    "links": {page: request.params.page, sorting: request.query.sort}
  };
}
```

### Component.preprocess(storeProps, request)

With `.preprocess` you can modify the props returned from stores before passing them as final props to the route component.

```javascript
Tags.preprocess = (props, request) => {
  if (request.params.id) {
    props.selected = request.params.id;
    props.tags = props.tags.filter(tag => tag.get("id") === request.params.id);
  }
  return props;
};
```

## render-client

### storeId & appId

You should just use values from cerebellum's options.

### containerComponent (optional)

You can pass `containerComponent` function as option, the return value will be passed to `React.render`.
Container components are useful if you need to set context for all child components.

### prependTitle (optional)

With prependTitle you can prepend text to beginning of document's title. Rest of the title will be read from your route component's `.title`.

### Usage:
```javascript
import renderClient from 'cerebellum-react/render-client'

options.render = renderClient(React, {
  storeId: options.storeId,
  appId: options.appId,
  prependTitle: "My cool app - ",
  containerComponent: (store, component, props) => {
    return Layout({
      createComponent: () => { return component(props) },
      store: store
    });
  }
});
```

## render-server

### storeId & appId

You should just use values from cerebellum's options.

### containerComponent (optional)

You can pass `containerComponent` function as option, the return value will be passed to `React.renderToString`.

### prependTitle (optional)

With prependTitle you can prepend text to beginning of document's title. Rest of the title will be read from your route component's `.title`.

### Usage:
```javascript
import renderServer from 'cerebellum-react/render-server'

options.render = renderServer(React, {
  storeId: options.storeId,
  appId: options.appId,
  prependTitle: "My cool app - ",
  containerComponent: (store, component, props) => {
    return Layout({
      createComponent: () => { return component(props) },
      store: store
    });
  }
});
```

### Note
You have to pass React as param because context gets always set as `undefined` if different React instance renders the root component.