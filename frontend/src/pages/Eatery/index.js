import React from "react";
import { Route, Switch } from "react-router-dom";
import Reviews from "../../components/Reviews";
import EateryProfile from "./EateryProfile";
import Vouchers from "./Vouchers";

const Eatery = () => {
  return (
    <Switch>
      <Route path="/eatery/:eateryname/profile" component={EateryProfile} />
      <Route path="/eatery/:eateryname/vouchers" component={Vouchers} />
      <Route path="/eatery/:eateryname/reviews" component={Reviews} />
    </Switch>
  );
};

export default Eatery;
