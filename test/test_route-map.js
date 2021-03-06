import assert from 'assert';
import generateRouteMap from '../route-map';

const FlatRootComponent = {
  title: "FlatRootComponent",
  routes: {},
  stores: (request) => {
    return {
      "user": {}
    };
  }
};

const IndexComponent = {
  title: "IndexComponent",
  stores: (request) => {
    return {
      "latestPosts": {}
    };
  }
};

const PostsComponent = {
  title: "PostsComponent",
  stores: (request) => {
    return {
      "posts": {}
    };
  }
};

const PostComponent = {
  title: "PostComponent",
  stores: (request) => {
    return {
      "post": {id: request.params.id}
    };
  }
};

const RootComponent = {
  title: "RootComponent",
  routes: {
    "": IndexComponent,
    "posts": PostsComponent,
    "posts/:id": PostComponent
  },
  stores: (request) => {
    return {
      "user": {}
    };
  }
};

const SimpleComponent = {
  title: "SimpleComponent"
};

const SimpleRoutesComponent = {
  title: "SimpleRoutesComponent",
  routes: {
    "posts": PostsComponent
  }
};

const flatRoutes = {
  "/": FlatRootComponent
};

const nestedRoutes = {
  "/": RootComponent
};

const notDefinedRoutes = {
  "/": SimpleComponent
};

const noParentStoresRoutes = {
  "/": SimpleRoutesComponent
};

describe('Route map', () => {

  it('should return empty object with empty routes', () => {
    assert.deepEqual(generateRouteMap({}), {});
  });

  it('should return proper route map flat routes', () => {
    const expected = {
      "/": {
        "components": [FlatRootComponent],
        "stores": [FlatRootComponent.stores]
      }
    };
    assert.deepEqual(generateRouteMap(flatRoutes), expected);
  });

  it('should return properly nested route map for component with sub-routes', () => {
    const expected = {
      "/": {
        components: [ RootComponent, IndexComponent ],
        stores: [ RootComponent.stores, IndexComponent.stores ]
      },
      "/posts": {
        components: [ RootComponent, PostsComponent ],
        stores: [ RootComponent.stores, PostsComponent.stores ]
      },
      "/posts/:id": {
        components: [ RootComponent, PostComponent ],
        stores: [ RootComponent.stores, PostComponent.stores ]
      }
    };
    assert.deepEqual(generateRouteMap(nestedRoutes), expected);
  });

  it('should return stores as empty object if stores function is not defined', () => {
    const expected = {
      "/": {
        "components": [SimpleComponent],
        "stores": [{}]
      }
    };

    assert.deepEqual(generateRouteMap(notDefinedRoutes), expected);
  });

  it('should return properly indexed stores array even if parent component does not have any stores', () => {
    const expected = {
      "/": {
        "components": [SimpleRoutesComponent],
        "stores": [{}]
      },
      "/posts": {
        "components": [SimpleRoutesComponent, PostsComponent],
        "stores": [{}, PostsComponent.stores]
      }
    };
    assert.deepEqual(generateRouteMap(noParentStoresRoutes), expected);
  });

});
