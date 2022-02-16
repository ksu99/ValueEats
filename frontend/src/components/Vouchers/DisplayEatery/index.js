import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useStyles } from "./styles.js";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { bookVoucher } from "../../../actions/vouchers.js";
import { FiClock, FiCalendar } from "react-icons/fi";
import { FilledButton } from "../../General/button.js";
import { toast } from "react-toastify";

const DisplayEatery = ({ voucher, eateryId }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const {
    availableQuantity,
    description,
    discount,
    endDateTime,
    startDateTime,
  } = voucher;
  const [available, setAvailable] = useState(availableQuantity);

  // setting endDate and endTime
  var endTime = new Date(endDateTime);
  var endDate = endTime.toLocaleDateString("en-AU");
  endTime = endTime.toLocaleTimeString([], {
    timeStyle: "short",
  });

  //setting startDate and startTime
  var startTime = new Date(startDateTime);
  var startDate = startTime.toLocaleDateString("en-AU");
  startTime = startTime.toLocaleTimeString([], {
    timeStyle: "short",
  });

  // function to book voucher and send a response 
  const book = () => {
    const reqBody = {
      voucherInstanceID: voucher._id,
      dinerID: user._id,
      eateryID: eateryId,
    };

    bookVoucher(reqBody)
      .then(() => {
        setAvailable(available - 1);
        toast.success('Successfully booked');
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Grid item container direction="row">
            <Grid item xs={4}>
              <div className={classes.discount}>
                <Typography
                  className={classes.discountSize + " " + classes.centered}
                >
                  {discount}% <span className={classes.offSize}>OFF</span>
                </Typography>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.row}>
                <div className={classes.columnIcon}>
                  <FiCalendar className={classes.iconSize} />
                </div>
                <div>
                  <Typography className={classes.dateSize}>
                    Valid Date:
                  </Typography>
                  <Typography className={classes.dateSize}>
                  {startDate} - {endDate}
                  </Typography>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.columnIcon}>
                  <FiClock className={classes.iconSize} />
                </div>
                <div>
                  <Typography className={classes.dateSize}>Time:</Typography>
                  <Typography className={classes.dateSize}>
                    {startTime} - {endTime}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={3} className={classes.center}>
              <div>
                <Typography color="textSecondary" className={classes.release}>
                  {available} remaining
                </Typography>
                <FilledButton variant="contained" onClick={book}>
                  BOOK NOW
                </FilledButton>
              </div>
            </Grid>
          </Grid>

          <Typography
            className={classes.description}
            variant="subtitle2"
            color="textSecondary"
          >
            Description:
            {description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayEatery;
