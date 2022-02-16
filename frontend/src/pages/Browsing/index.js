import React from "react";
import { Route, Switch } from "react-router-dom";
import EateryList from "./EateryList";
import Recommendations from "./Recommendations";

const Browsing = () => {
  return (
    <Switch>
      <Route path="/category/:categoryname" component={EateryList} />
      <Route path="/recommendations" component={Recommendations} />
    </Switch>
  );
};

export default Browsing;
