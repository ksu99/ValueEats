import { React, useState, useEffect } from "react";
import { getEateryByCuisine, getEateryByTime } from "../../../actions/browsing";
import {
  GridList,
  GridListTile,
  TextField,
  Typography,
} from "@material-ui/core";
import Select from "react-select";
import "./styles.css";
import EateryCard from "./EateryCard";
import categoryList from "../../../assets/categories";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const locationOptions = [
  { value: "cabramatta", label: "Cabramatta" },
  { value: "canley heights", label: "Canley Heights" },
  { value: "lansvale", label: "Lansvale" },
  { value: "ryde", label: "Ryde" },
  { value: "lidcombe", label: "Lidcombe" },
  { value: "strathfield", label: "Strathfield" },
];

const ratingOptions = [
  { value: 1, label: "> 1" },
  { value: 2, label: "> 2" },
  { value: 3, label: "> 3" },
  { value: 4, label: "> 4" },
  { value: 5, label: "5" },
  { value: "none", label: "None" },
];

const EateryList = () => {
  const location = useLocation();
  const category = location.pathname.replace(/\/category\//g, "");
  const { isCuisine, isSearchedByTime } = useSelector(
    (state) => state.browsing
  );
  console.log("isCuisine from EateryList", isCuisine);
  console.log("category from EateryList", category);
  console.log("isSearchedByTime from EateryList", isSearchedByTime);
  const [eateryList, setEateryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEatery, setSearchEatery] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let response = null;
      if (!isSearchedByTime) {
        response = await getEateryByCuisine(category.toLowerCase());
      } else {
        response = await getEateryByTime(
          isSearchedByTime.startDate,
          isSearchedByTime.endDate
        );
      }
      console.log("EateryList");
      console.log(response.data);
      if (response.data) {
        setEateryList(response.data);
        setFilteredList(response.data);
      }
    };
    fetch();
    setLoading(true);
  }, [isSearchedByTime]);

  function handleChange(e) {
    setSearchEatery(e.target.value);
  }

  function handleRatingChange(e) {
    if (e.value !== "none") {
      setFilteredList(
        eateryList.filter((eatery) => {
          if (eatery.reviewRating >= e.value) {
            return eatery;
          }
        })
      );
    } else {
      setFilteredList(eateryList);
    }
  }

  function handleLocationChange(e) {
    if (e.length !== 0) {
      let temp = new Set();
      e.map((obj) => {
        eateryList.map((eatery) => {
          if (eatery.address.toLowerCase().includes(obj.value)) {
            temp.add(eatery);
          }
        });
      });
      setFilteredList(Array.from(temp));
    } else {
      setFilteredList(eateryList);
    }
  }

  function handleCategoryChange(e) {
    if (e.length !== 0) {
      let temp = new Set();
      e.map((obj) => {
        eateryList.map((eatery) => {
          if (eatery.cuisines.includes(obj.value)) {
            temp.add(eatery);
          }
        });
      });
      setFilteredList(Array.from(temp));
    } else {
      setFilteredList(eateryList);
    }
  }

  return (
    <>
      {loading && (
        <div className="eatery-list-container">
          {!isSearchedByTime && (
            <h1 className="eatery-modal-header">Browse {category} Eateries</h1>
          )}
          {isSearchedByTime && (
            <h1 className="eatery-modal-header">
              {isSearchedByTime.startDate.toString().slice(0, 15)} to{" "}
              {isSearchedByTime.endDate.toString().slice(0, 15)}
            </h1>
          )}
          <div className="eatery-list-filter-container">
            <div className="filters-container">
              <div className="search-eatery-textfield">
                <Typography className="filter-text">
                  Search by eatery name:
                </Typography>
                <TextField
                  type="input"
                  placeholder="Find an eatery ..."
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ className: "search-eatery-input" }}
                />
              </div>
              <div className="filter-select">
                <Typography className="filter-text">
                  Filter by rating:
                </Typography>
                <Select options={ratingOptions} onChange={handleRatingChange} />
              </div>
              <div className="filter-select">
                <Typography className="filter-text">
                  Filter by category:
                </Typography>
                <Select
                  options={categoryList.filter((category) => {
                    if (isCuisine) {
                      if (!category.isCuisine) {
                        return category;
                      }
                    } else {
                      if (category.isCuisine) {
                        return category;
                      }
                    }
                  })}
                  onChange={handleCategoryChange}
                  isMulti
                  defaultValue="none"
                />
              </div>
              <div className="filter-select">
                <Typography className="filter-text">
                  Filter by location:
                </Typography>
                <Select
                  options={locationOptions}
                  onChange={handleLocationChange}
                  isMulti
                  defaultValue="none"
                />
              </div>
            </div>
          </div>
          <GridList
            col={2}
            className="eatery-grid-list"
            spacing={50}
            cellHeight={500}
          >
            {filteredList
              .filter((eatery) => {
                if (searchEatery === "") {
                  return eatery;
                } else if (
                  eatery.name.toLowerCase().includes(searchEatery.toLowerCase())
                ) {
                  return eatery;
                }
              })
              .map((eatery) => {
                return (
                  <GridListTile className="eatery-grid-list-tile" col={1}>
                    <EateryCard eatery={eatery} />
                  </GridListTile>
                );
              })}
          </GridList>
        </div>
      )}
    </>
  );
};

export default EateryList;
