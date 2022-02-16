import { React, useState } from "react";
import { GridList, GridListTile, Tabs, Tab, Slide } from "@material-ui/core";
import "./styles.css";
import EateryCard from "../../pages/Browsing/EateryList/EateryCard";

const RecommendationsList = (props) => {
  const { eateryList } = props;
  const { all, topRating, commonCuisines, nearbyLocation, followingList } =
    eateryList;
  const [tab, setTab] = useState(0);
  const [currList, setcurrList] = useState([]);

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  const TabPanel = () => {
    if (tab === 0) {
      setcurrList(all);
    } else if (tab === 1) {
      setcurrList(followingList);
    } else if (tab === 2) {
      setcurrList(commonCuisines);
    } else if (tab === 3) {
      setcurrList(topRating);
    } else if (tab === 4) {
      setcurrList(nearbyLocation);
    }
    return (
      <GridList
        col={2}
        className="eatery-grid-list"
        spacing={50}
        cellHeight={500}
      >
        {currList.map((eatery) => {
          return (
            <Slide
              direction="down"
              in
              mountOnEnter
              unmountOnExit
              timeout={1000}
            >
              <GridListTile className="eatery-grid-list-tile" col={1}>
                <EateryCard eatery={eatery} />
              </GridListTile>
            </Slide>
          );
        })}
      </GridList>
    );
  };
  return (
    <>
      <div className="eatery-list-container">
        <h1 className="eatery-modal-header">Recommendations</h1>
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          className="tab-container-rec"
          TabIndicatorProps={{
            style: { background: "green" },
          }}
          centered
        >
          {["All", "Following", "Favourites", "Top Rated", "Near You"].map(
            (label, index) => (
              <Tab
                label={label}
                style={{
                  fontWeight: index === tab ? "600" : "400",
                  color: index !== tab && "black",
                }}
                className="tab-rec-independent"
              />
            )
          )}
        </Tabs>
        <TabPanel />
      </div>
    </>
  );
};

export default RecommendationsList;
