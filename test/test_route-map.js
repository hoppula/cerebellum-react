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

const flatRoutes = {
  "/": FlatRootComponent
};

const nestedRoutes = {
  "/": RootComponent
};

describe('Route map', () => {
  describe('generateRouteMap', () => {
    it('should return empty object with empty routes', () => {
      assert.deepEqual(generateRouteMap({}), {});
    });

    it('should return proper route map flat routes', () => {
      const expected = {
        "/": {
          "components": [
            {
              "title": "FlatRootComponent",
              "routes": {},
              "stores": FlatRootComponent.stores
            }
          ],
          "stores": [
            FlatRootComponent.stores
          ]
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
  });
});
