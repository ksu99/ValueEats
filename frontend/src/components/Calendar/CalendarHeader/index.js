import React from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import NativeSelect from "@material-ui/core/NativeSelect";
import { DarkButton } from "../../General/button";
import { IconButton } from "@material-ui/core";
import { withRouter } from "react-router";

const CalendarHeader = ({
  currentDate,
  handleChange,
  viewType,
  setViewType,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let history = useHistory();

  function NavigateBooked() {
    history.push({
      pathname: "/profile",
      state: { tabNumber: 1, pageNumber: 0 },
    });
  }

  return (
    <div className="calendar-header">
      <div>
        <IconButton>
          <ChevronLeftIcon
            style={{ fontSize: 32, cursor: "pointer" }}
            onClick={() => handleChange(-1)}
          />
        </IconButton>
        <IconButton>
          <ChevronRightIcon
            style={{ fontSize: 32, cursor: "pointer" }}
            onClick={() => handleChange(1)}
          />
        </IconButton>
        <div>{months[currentDate.getMonth()]}</div>
      </div>
      <div>
        <DarkButton variant="outlined" onClick={NavigateBooked}>
          View vouchers booked
        </DarkButton>
        <NativeSelect
          style={{ color: "white", fontSize: 18 }}
          className="calendar-view-type"
          value={viewType}
          name="view-calendar"
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </NativeSelect>
      </div>
    </div>
  );
};

export default withRouter(CalendarHeader);
