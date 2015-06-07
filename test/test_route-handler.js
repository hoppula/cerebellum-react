import assert from 'assert';
import routeHandler from '../route-handler';

const routeComponent = {
  components: [],
  stores: []
};

function handler(params) {
  return params;
}

function context() {
  return this;
}

describe('Route handler', () => {
  it('should return passed handler for components with .components and .stores', () => {
    assert.equal(routeHandler(routeComponent), routeComponent);
  });

  it('should call passed handler function with params for other components', () => {
    assert.equal(routeHandler(handler, [123]), 123);
  });

  it('should retain route handler\'s this context', () => {
    assert.deepEqual(routeHandler.call({title: "value"}, context), {title: "value"});
  });
});
