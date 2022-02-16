import React from "react";

import RecommendationsList from "../../../components/RecommendationsList";

const Recommendations = (props) => {
  // you can access arguments from the props or through hooks
  const { eateryList } = props.history.location.state;

  // not sure how you want to handle the different tabs

  return <RecommendationsList eateryList={eateryList} />;
};

export default Recommendations;
