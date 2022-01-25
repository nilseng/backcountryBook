import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./Welcome.scss";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { StatBar } from "./StatBar";

export const Welcome = () => {
  const { loginWithRedirect } = useAuth0();
  const history = useHistory();
  return (
    <>
      <div
        className="bg-storebjorn fixed-top vw-100 vh-100"
        style={{ zIndex: -1 }}
      ></div>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <Card className="welcome-card p-4">
          <p className="display-4 font-weight-light">
            The place to explore and share skiing experiences
          </p>
          <div className="d-flex flex-columns justify-content-center align-items">
            <span>
              <Button
                variant="outline-primary text-light"
                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
              >
                Sign up
              </Button>
            </span>
            <span>
              <Button variant="link" onClick={() => history.push("/feed")}>
                or start exploring
              </Button>
            </span>
          </div>
        </Card>
      </div>
      <StatBar />
    </>
  );
};
