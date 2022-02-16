import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import {
  AuthenticationPages,
  UserPages,
  HomePages,
  BrowsingPages,
  EateryPages,
} from "../pages";
import Calendar from "../components/Calendar";
import FollowingFeed from "../components/FollowingFeed";
import TopNav from "../components/TopNav";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const Routes = () => {
  return (
    <Provider store={store}>
      <Router>
        <TopNav />
        <ToastContainer draggable autoClose={3000} />
        <HomePages />
        <AuthenticationPages />
        <BrowsingPages />
        <EateryPages />
        <Route exact path="/profile" component={UserPages} />
        <Route exact path="/feed" component={FollowingFeed} />
        <Route exact path="/calendar" component={Calendar} />
        {/* <Redirect to="/" /> */}
      </Router>
    </Provider>
  );
};

export default Routes;
