import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./Store";
import SpotifyProvider from "./modules/spotify/SpotifyProvider";

ReactDOM.render(
  <Provider store={store}>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </Provider>,
  document.querySelector("#app-container"),
);
