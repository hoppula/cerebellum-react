import assert from 'assert';
import React from 'react';
import cheerio from 'cheerio';
import createRender from '../render';
import 'native-promise-only';

class RootComponent extends React.Component {

  static stores = (request) => {
    return {
      "user": {username: request.params.username}
    };
  }

  render() {
    return (
      <div className="Root">
        <h1>Root component</h1>
        <div className="user">{this.props.user.username}</div>
        {this.props.children}
      </div>
    );
  }

}

class ChildComponent extends React.Component {

  static stores = (request) => {
    return {
      "post": {id: request.params.id}
    };
  }

  render() {
    return (
      <div className="Child">
        <h1>Child component</h1>
        <h2>{this.props.post.id}</h2>
      </div>
    );
  }

}

describe('Render', () => {
  it('should properly render nested components with .stores definitions fetched as props', () => {
    const routeComponent = {
      components: [RootComponent, ChildComponent],
      stores: [RootComponent.stores, ChildComponent.stores]
    };

    const render = createRender(React, {
      storeId: "test",
      appId: "app",
      prependTitle: "App - "
    });

    const document = cheerio.load("<!doctype html><html><body><div id='app'></div></body></html>");

    const request = {
      params: {
        id: 123,
        username: "Tester"
      }
    };

    const context = {
      store: {
        // just pass the input values through,
        // it's enough for this test, we're not testing fetch here
        fetchAll: (stores) => {
          return new Promise((resolve) => {
            resolve(stores);
          });
        },
        snapshot: () => {}
      }
    };

    return render.call(context, document, routeComponent, request).then(html => {
      const result = cheerio.load(html);
      assert.equal("Root component", result('.Root > h1').text());
      assert.equal("Tester", result('.Root > .user').text());
      assert.equal("Child component", result('.Child > h1').text());
      assert.equal("123", result('.Child > h2').text());
    });

  });
});
