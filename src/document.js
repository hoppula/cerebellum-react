class Document {
  constructor(options={}) {
    this.appId = options.appId;
    this.document = options.document;
    this.storeId = options.storeId;
    this.environment = typeof this.document.html === "function"
      ? "server"
      : "client";
  }

  set title(title) {
    if (this.environment === "server") {
      this.document("title").html(title);
    } else {
      this.document.getElementsByTagName("title")[0].innerHTML = title;
    }
  }

  set snapshot(snapshot) {
    if (this.storeId) {
      this.document(`#${this.storeId}`).text(snapshot);
    }
  }

  render(React, component) {
    if (this.environment === "server") {
      this.document(`#${this.appId}`).html(React.renderToString(component));
      return this.document.html();
    } else {
      React.render(component, this.document.getElementById(this.appId));
      return this.document.documentElement.outerHTML;
    }
  }
}

export default Document;
