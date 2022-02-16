import { React, useState } from "react";
import { TextField, IconButton } from "@material-ui/core";
import "./styles.css";
import { Search } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import categoryList from "../../assets/categories";
import { useDispatch } from "react-redux";
import { setCuisine } from "../../redux/slices/browsing.slice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState("");
  let history = useHistory();

  function handleChange(values) {
    setUserSearch(values);
  }

  function handleClick(category, isCuisine) {
    history.push({
      pathname: "/category/" + category,
    });
    dispatch(setCuisine(isCuisine));
  }

  const onKeyPress = async (event) => {
    if (event.charCode === 13) {
      if (userSearch.length !== 0) {
        handleClick(userSearch);
      } else {
        handleClick("all");
      }
    }
  };

  return (
    <>
      <Autocomplete
        onKeyPress={onKeyPress}
        options={categoryList}
        getOptionLabel={(category) => category.label}
        autoHighlight
        autoSelect
        onInputChange={handleChange}
        className="eatery-search-field"
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Enter a cuisine or category ..."
          />
        )}
      />
      <IconButton
        onClick={() => {
          if (userSearch.length !== 0) {
            handleClick(userSearch);
          } else {
            handleClick("all");
          }
        }}
      >
        <Search className="search-icon" />
      </IconButton>
    </>
  );
};

export default SearchBar;
