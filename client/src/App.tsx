import React, { useEffect, useState } from "react";
import { Switch, Route, Router, Redirect } from "react-router-dom";

import history from "./utils/history";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import TripModal from "./components/TripModal";
import { ITrip } from "./models/Trip";
import Peaks from "./components/Peaks";
import { Welcome } from "./components/Welcome";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";

const defaultTrip: ITrip = {
  name: "",
  tripDate: Date.now(),
  description: "",
  imageIds: [],
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  const [trip, setTrip] = useState<ITrip>(defaultTrip);
  const [trips, setTrips] = useState<ITrip[]>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/trips").then(async (res) => {
      const trips = await res.json();
      setTrips(trips);
    });
  }, []);
  return (
    <>
      <Router history={history}>
        <NavBar setShowModal={setShowModal} />
        <Switch>
          <Route path="/welcome" component={Welcome} />
          <Route
            path="/"
            exact
            render={() =>
              isLoading ? (
                <Loading text="Loading..." height="80vh" margin="2rem" />
              ) : isAuthenticated ? (
                <Redirect to="/feed" />
              ) : (
                <Welcome />
              )
            }
          />
          <Route
            path="/feed"
            render={() => (
              <Feed
                trips={trips}
                setTrip={setTrip}
                setShowModal={setShowModal}
              />
            )}
          />
          <Route path="/peaks" component={Peaks} />
          <PrivateRoute
            path="/profile"
            component={Profile}
            trips={trips}
            setTrip={setTrip}
            setShowModal={setShowModal}
          />
        </Switch>
      </Router>
      {trips && (
        <TripModal
          trip={trip}
          setTrip={setTrip}
          defaultTrip={defaultTrip}
          showModal={showModal}
          setShowModal={setShowModal}
          setTrips={setTrips}
        />
      )}
    </>
  );
};

export default App;
