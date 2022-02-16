import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDate } from "../../redux/slices/browsing.slice";
import "./SearchDate.css";

function SearchDate() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const handleClick = () => {
    dispatch(setDate({ startDate, endDate }));
    history.push({
      pathname: "/category/searchByTime",
    });
  };

  return (
    <div className="search_date">
      <DateRangePicker 
        ranges={[selectionRange]}
        onChange={handleSelect}
        rangeColors={["green"]}
        color="green"
      />
      <Button onClick={handleClick}>Search Date</Button>
    </div>
  );
}

export default SearchDate;
