import React, { useState } from "react";
import { useStyles } from "./styles.js";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Modal,
} from "@material-ui/core";
import AddReview from "../../AddReview";
import { FilledButton } from "../../General/button.js";

const DinerRedeemed = (props) => {
  const { user } = useSelector((state) => state.auth);
  const classes = useStyles();
  const { eateryName, discount, endDateTime, redeemed } = props.voucher;
  const [open, setOpen] = useState(false);

  //set the endDate
  var endDate = new Date(endDateTime);
  endDate = endDate.toLocaleDateString("en-AU");

  //set the redeem text
  var redeemText = "";
  if (redeemed) {
    redeemText = "Reedeemed";
  } else {
    redeemText = "Expired";
  }

  const reviewOpen = () => {
    setOpen(true);
  };

  const updateClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Grid item xs container direction="row">
            <Grid item xs>
              <Typography gutterBottom variant="h6">
                {eateryName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" className={classes.discount}>
                {discount}% <span className={classes.discountSize}>OFF</span>
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="subtitle2">
            {redeemText} on {endDate}
          </Typography>
          {redeemed && (
            <FilledButton
              variant="contained"
              className={classes.button}
              onClick={reviewOpen}
            >
              Add review
            </FilledButton>
          )}
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={updateClose}
        style={{ position: "absolute", top: "50%", left: "10%" }}
      >
        <AddReview
          user={user}
          onCancel={updateClose}
          eatery={props.voucher}
          centered
        />
      </Modal>
    </div>
  );
};

export default DinerRedeemed;
