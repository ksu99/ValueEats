import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const Authentication = () => {
  const path = "/auth";
  return (
    <Switch>
      <Route exact path={path}>
        <AuthHome url={path} />
      </Route>
      <Route exact path={`${path}/login`} component={Login} />
      <Route exact path={`${path}/register`} component={Register} />
    </Switch>
  );
};

export default Authentication;

// Basic home page
const AuthHome = ({ url }) => (
  <div>
    <Link to={`${url}/login`}>
      <button>Login</button>
    </Link>
    <Link to={`${url}/register`}>
      <button>Register</button>
    </Link>
  </div>
);
