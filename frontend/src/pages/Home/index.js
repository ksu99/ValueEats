import React from "react";
import { Route } from "react-router-dom";
import DinerHome from "../../components/DinerHome";

const Home = () => {
  return <Route exact path="/" component={DinerHome} />;
};

export default Home;
