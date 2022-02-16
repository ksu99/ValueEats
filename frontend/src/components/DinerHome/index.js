import { React, useState, useEffect } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { getRecommendationsList } from "../../actions/recommendations";
import "./styles.css";
import CategoryCard from "./CategoryCard";
import { ArrowRight, ArrowLeft } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import categoryList from "../../assets/categories";
import EateryCard from "../../pages/Browsing/EateryList/EateryCard";
import { useSelector, useDispatch } from "react-redux";
import { setCuisine } from "../../redux/slices/browsing.slice";

const DinerHome = () => {
  const dispatch = useDispatch();
  const [recommendations, setRecommendations] = useState({
    all: [],
    topRating: [],
    followingList: [],
    commonCuisines: [],
    nearbyLocation: [],
  });
  const [isLoading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let response = null;
    const fetch = async () => {
      response = await getRecommendationsList(user._id);
      if (response.data) {
        setRecommendations(response.data);
      }
    };
    if (user && Object.keys(user).length !== 0 && user.isDiner) {
      console.log(user);
      fetch();
    }
    setLoading(true);
  }, []);

  function handleLeft(id) {
    let leftScroll = document.getElementById(id).scrollLeft;
    document.getElementById(id).scrollTo({
      left: leftScroll - 500,
      behavior: "smooth",
    });
  }

  function handleRight(id) {
    let leftScroll = document.getElementById(id).scrollLeft;
    document.getElementById(id).scrollTo({
      left: leftScroll + 500,
      behavior: "smooth",
    });
  }

  let history = useHistory();

  function handleClick(category, isCuisine) {
    history.push({
      pathname: "/category/" + category,
    });
    dispatch(setCuisine(isCuisine));
  }

  function handleRecClick() {
    history.push({
      pathname: "/recommendations",
      state: { eateryList: recommendations },
    });
  }

  const Recommendations = () => {
    if (recommendations.all.length !== 0) {
      return (
        <>
          <div className="recommendations-header">Recommendations</div>
          <div className="recommendations-button-container">
            <Button
              className="recommendations-button"
              variant="text"
              color="primary"
              onClick={handleRecClick}
            >
              View all recommendations
            </Button>
          </div>
          <div className="diner-home-tab-container">
            <Button
              className="scroll-button-container"
              onClick={() => {
                handleLeft("diner-home-recommendations-list");
              }}
            >
              <ArrowLeft className="scroll-button" />
            </Button>
            <div className="diner-home-recommendations-container">
              <div
                id="diner-home-recommendations-list"
                className="diner-home-recommendations-list"
              >
                {recommendations.all.map((eatery) => {
                  return (
                    <div className="recommendations-card">
                      <EateryCard eatery={eatery} />
                    </div>
                  );
                })}
              </div>
            </div>
            <Button
              className="scroll-button-container"
              onClick={() => {
                handleRight("diner-home-recommendations-list");
              }}
            >
              <ArrowRight className="scroll-button" />
            </Button>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    isLoading && (
      <>
        <div className="diner-home-outer-container">
          <div className="diner-home-header">
            <div className="diner-home-header-grid">
              <h1 className="diner-home-header-message">Cheap eats any time</h1>
              <div className="all-eateries-button-container">
                <Button
                  className="all-eateries-button"
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    handleClick("all");
                  }}
                >
                  View All Eateries
                </Button>
              </div>
            </div>
            <div className="diner-header">
              <img
                src="https://bit.ly/3hx58Ld"
                className="diner-home-header-image"
                alt="diner-home-header"
              />
            </div>
          </div>
          <div>
            <Recommendations />
            <div className="cuisine-header">Cuisines</div>
            <div className="diner-home-tab-container">
              <Button
                className="scroll-button-container"
                onClick={() => {
                  handleLeft("diner-home-cuisine-list");
                }}
              >
                <ArrowLeft className="scroll-button" />
              </Button>
              <div className="diner-home-cuisine-container">
                <div
                  id="diner-home-cuisine-list"
                  className="diner-home-cuisine-list"
                >
                  {categoryList.map((category) => {
                    if (category.isCuisine) {
                      return (
                        <div className="cuisine-list-tile">
                          <CategoryCard
                            category={category}
                            isCuisine={category.isCuisine}
                            handleClick={handleClick}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                className="scroll-button-container"
                onClick={() => {
                  handleRight("diner-home-cuisine-list");
                }}
              >
                <ArrowRight className="scroll-button" />
              </Button>
            </div>
            <div className="cuisine-header">Categories</div>
            <div className="diner-home-tab-container">
              <Button
                className="scroll-button-container"
                onClick={() => {
                  handleLeft("diner-home-category-list");
                }}
              >
                <ArrowLeft className="scroll-button" />
              </Button>
              <div className="diner-home-category-container">
                <div
                  id="diner-home-category-list"
                  className="diner-home-category-list"
                >
                  {categoryList.map((category) => {
                    if (!category.isCuisine) {
                      return (
                        <div className="category-list-tile">
                          <CategoryCard
                            category={category}
                            handleClick={handleClick}
                            isCuisine={category.isCuisine}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                className="scroll-button-container"
                onClick={() => {
                  handleRight("diner-home-category-list");
                }}
              >
                <ArrowRight className="scroll-button" />
              </Button>
            </div>
          </div>
          <div className="diner-home-footer">
            <div className="diner-home-footer-grid">
              <h1 className="diner-home-footer-message">
                Contact
                <br /> Us{" "}
              </h1>
            </div>
            <img
              src="https://bit.ly/3hx58Ld"
              className="diner-home-footer-image"
            />
          </div>
        </div>
      </>
    )
  );
};

export default DinerHome;
