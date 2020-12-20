import React from "react";
import { Switch, Route, Router } from "react-router-dom";

import history from "./utils/history";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router history={history}>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Feed} />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
