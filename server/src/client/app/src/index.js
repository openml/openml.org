import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Lato:400,700", "sans-serif"],
  },
});

ReactDOM.render(<App />, document.getElementById("root"));
