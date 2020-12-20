import React, { useState } from "react";
import { Switch, Route, Router } from "react-router-dom";

import history from "./utils/history";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import TripModal from "./components/TripModal";

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <Router history={history}>
        <NavBar setShowModal={setShowModal} />
        <Switch>
          <Route path="/" exact component={Feed} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
      <TripModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default App;
