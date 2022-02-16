import React from "react";
import { useStyles } from "./styles.js";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// This is the card used with the Diner has booked a Voucher
const DinerBooked = (props) => {
  const classes = useStyles();
  const { eateryName, discount, endDateTime, startDateTime, voucherCodeId } =
    props.voucher;

  //setting endDate and endTime for the cards
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

  return (
    <Card className={classes.root}>
      <CardContent className={classes.card}>
        <Grid item xs container direction="row">
          <Grid item xs>
            <Typography gutterBottom variant="h6" className={classes.font}>
              {eateryName}
            </Typography>
            <Typography className={classes.code} gutterBottom>
              Code: {voucherCodeId}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h4"
              color="textSecondary"
              className={classes.discount}
            >
              {discount}% <span className={classes.discountSize}>OFF</span>
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="subtitle2" color="textSecondary">
          Valid on {endDate} - {startDate} at {startTime} - {endTime}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DinerBooked;
