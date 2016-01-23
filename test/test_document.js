import assert from 'assert';
import cheerio from 'cheerio';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Document from '../dist/document';

class TestComponent extends React.Component {
  render() {
    return <div className="component">Content</div>;
  }
}

let doc, document;

describe('Document', () => {

  before(() => {
    doc = cheerio.load("<!doctype html><html><head><title></title></head><body><div id='app'></div><script id='test'></script></body></html>");

    document = new Document({
      appId: "app",
      document: doc,
      storeId: "test"
    });
  });

  it('should set title', () => {
    document.title = "New title";
    assert.equal(document.document("title").html(), "New title");
  });

  it('should save snapshot to html', () => {
    document.snapshot = "snapshot";
    assert.equal(document.document("#test").html(), "snapshot");
  });

  it('should render', () => {
    const html = cheerio.load(document.render(ReactDOM, React.createFactory(TestComponent)()));
    assert.equal(html(".component").html(), "Content");
  });
});
