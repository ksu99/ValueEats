import { useStyles } from "./styles.js";
import React, { useState } from "react";
import { Card, CardContent, Grid } from "@material-ui/core";
import { redeemVoucher } from "../../../actions/vouchers.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FilledButton } from "../../General/button.js";

const EateryBookedVoucher = ({ voucher }) => {
  const {
    dinerName,
    discount,
    endDateTime,
    startDateTime,
    redeemed,
    voucherCodeId,
  } = voucher;
  const { user } = useSelector((state) => state.auth);
  const [isRedeem, setIsRedeem] = useState(redeemed);
  const classes = useStyles();

  // redeem voucher and send a response
  const redeem = () => {
    const reqBody = {
      voucherCodeID: voucherCodeId,
      eateryID: user._id,
      dinerID: voucher.diner,
    };

    redeemVoucher(reqBody)
      .then(() => {
        setIsRedeem(true);
        toast.success("Successfully Redeemed");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  // setting endDate and endTime
  var endTime = new Date(endDateTime);
  var endDate = endTime.toLocaleDateString("en-AU");
  endTime = endTime.toLocaleTimeString([], {
    timeStyle: "short",
  });

  //setting startDate and startTime
  var startTime = new Date(startDateTime);
  startTime = startTime.toLocaleTimeString([], {
    timeStyle: "short",
  });

  return !isRedeem ? (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Grid item xs container direction="row" className={classes.bottom}>
          <Grid item xs>
            <div className={classes.diner}>{dinerName}</div>
            <div>Code: {voucherCodeId}</div>
          </Grid>
          <Grid item>
            <div>Discount: {discount}% OFF</div>
            <div>Date: {endDate} </div>
            <div>
              Time: {startTime} - {endTime}
            </div>
          </Grid>
        </Grid>
        <FilledButton
          variant="contained"
          className={classes.button}
          onClick={redeem}
          disabled={isRedeem}
        >
          REDEEM
        </FilledButton>
      </CardContent>
    </Card>
  ) : (
    <> </>
  );
};

export default EateryBookedVoucher;
