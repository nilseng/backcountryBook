import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ component: Component, path, ...rest }: any) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
        screen_hint: "signup",
      });
    };
    fn();
  }, [isLoading, isAuthenticated, loginWithRedirect, path]);

  const render = (props: any) => {
    return isAuthenticated === true ? <Component {...props} {...rest} /> : null;
  };

  return <Route path={path} render={render} />;
};

export default PrivateRoute;
