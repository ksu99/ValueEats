import React, { useEffect, useState } from "react";
import { deleteVoucher } from "../../../actions/vouchers";
import { useStyles } from "./styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import VoucherForm from "../../VoucherForm";

const EateryAvaliableVoucher = (props) => {
  const classes = useStyles();
  const [voucher, setVoucher] = useState(props.voucher);
  const {
    _id,
    availableQuantity,
    quantity,
    description,
    discount,
    endDateTime,
    startDateTime,
    isReleased,
    releaseDateTime,
  } = voucher;

  const [isReleasedText, setIsReleasedText] = useState("");
  const [isDeleted, setDelete] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  // set Voucher information
  const setData = async () => {
    if (isReleased) {
      setIsReleasedText("RELEASED");
    } else {
      setIsReleasedText("UNRELEASED");
    }
    var endDate = new Date(endDateTime);
    setSelectedDate(endDate);
    var endTime = endDate.toLocaleTimeString([], {
      timeStyle: "short",
    });
    setEndTime(endTime);
    endDate = endDate.toLocaleDateString("en-AU");
    setEndDate(endDate);
    var startTime = new Date(startDateTime);
    var startDate = startTime.toLocaleDateString("en-AU");
    setStartDate(startDate);
    startTime = startTime.toLocaleTimeString([], {
      timeStyle: "short",
    });
    setStartTime(startTime);
    var releaseDate = new Date(releaseDateTime);
    releaseDate = releaseDate.toLocaleDateString("en-AU");
    setReleaseDate(releaseDate);
  };

  useEffect(() => {
    setData();
  }, [voucher]);

  // set state of drawer to edit
  const updateOpen = () => {
    setDrawer(true);
  };

  // set the reoccuring text 
  const reoccuringText = () => {
    if (isReleased !== true && voucher.isRecurring === true) {
      let rules = voucher.recurrence[0].split(/(?::|;|=)+/);
      console.log("RECURRING TEXT");
      console.log(rules);
      
      if (rules[2] == "WEEKLY" && voucher.recurrence[0].includes("INTERVAL")){
        rules[2] = "FORTNIGHTLY";
      }
      return (
        <Typography>
          Recurring: {rules[2]}, {rules[4]} times
        </Typography>
      );
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDelete(true);
    await deleteVoucher(_id);
  };

  return !isDeleted ? (
    <div>
      <Card className={classes.root} elevation={5}>
        <CardContent className={classes.content}>
          <Grid item xs container direction="row">
            <Grid item xs>
              <Typography variant="h6">
                Date: {startDate} - {endDate}
              </Typography>
              <Typography variant="h6">
                Time: {startTime} - {endTime}
              </Typography>
              {reoccuringText()}
              <Typography>
                Qty: {availableQuantity ? availableQuantity : quantity}
              </Typography>
              <Typography>Discount: {discount}% OFF</Typography>
            </Grid>
            <Grid item>
              <Typography
                className={classes.state}
                style={isReleased ? { color: "green" } : { color: "red" }}
              >
                {isReleasedText}
              </Typography>
              <Typography color="textSecondary" className={classes.release}>
                Release Date: {releaseDate}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <Typography
                className={classes.description}
                variant="subtitle2"
                color="textSecondary"
              >
                Description: {description}
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Button
                variant="contained"
                className={classes.updateButton}
                onClick={updateOpen}
                disabled={isReleased}
              >
                UPDATE
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button
                variant="contained"
                className={classes.deleteButton}
                onClick={handleDelete}
                disabled={isReleased}
              >
                DELETE
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Drawer
        open={drawer}
        anchor="right"
        onClose={() => {
          setDrawer(false);
        }}
      >
        <VoucherForm
          setVoucher={setVoucher}
          isUpdated={true}
          voucher={voucher}
          date={selectedDate}
          setDrawer={setDrawer}
        />
      </Drawer>
    </div>
  ) : (
    <> </>
  );
};

export default EateryAvaliableVoucher;