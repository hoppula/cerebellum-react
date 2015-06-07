# Cerebellum React

`cerebellum-react` lets you easily create isomorphic apps with Cerebellum & React.

This package contains a wrapper function that sets up everything for you, but you can also choose what helpers to include by requiring individual modules.

## cerebellum-react

cerebellum-react wrapper will setup nested route mappings, route handler and renderer for you.

Use `prependTitle` option to prepend a string to each component's static title.

With `containerComponent` option you can create a layout component that can e.g. setup the context for all child components.

```javascript
import React from 'react';
import Client from 'cerebellum/client';
import Cerebellum from 'cerebellum-react'
import options from './options';

options.prependTitle = "urls - ";
options.containerComponent = (store, component, props) => {
  return Layout({
    createComponent: () => { return component() },
    store: store
  });
};

Cerebellum(Client, React, options);
```

## cerebellum-react/route-handler

### Component static methods

When using `route-handler` in conjunction with `render` you get some really useful static methods for your route components.

`route-handler` checks if your route returns a React component that defines `title` and `stores` properties and then returns it to be handled by `render`.

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

## cerebellum-react/render

### storeId & appId

You should just use values from cerebellum's options.

### containerComponent (optional)

You can pass `containerComponent` function as option, the return value will be passed to `React.render`.
Container components are useful if you need to set context for all child components.

### prependTitle (optional)

With prependTitle you can prepend text to beginning of document's title. Rest of the title will be read from your route component's `.title`.

### convertProps (optional)

If your app does not need immutable data structures, you can convert all props to plain JS objects with this option

### Usage:
```javascript
import createRender from 'cerebellum-react/render'

options.render = createRender(React, {
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

## cerebellum-react/route-map

`route-map` will generate nested route map of the components in your app.


### Usage:
```javascript
options.routes = routeMap(routes);
```

## Note
You have to pass React as param because context gets always set as `undefined` if different React instance renders the root component.

### TODO
- [x] Merge flat/nested renderers & route handlers
- [x] Add tests for all modules
- [x] Better documentation
- [x] Create single wrapper for all modules so you don't have to require three different modules to get going
