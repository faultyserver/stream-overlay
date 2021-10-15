import * as React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Breakscreen from "./modules/breakscreen/Breakscreen";
import ThemeProvider from "./uikit/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Switch>
          <Route path="/breakscreen" component={Breakscreen} />
          <Route>
            <div>No Page</div>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
