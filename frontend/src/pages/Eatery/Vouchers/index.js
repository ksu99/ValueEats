import React, { useEffect, useState } from "react";
import { useStyles } from "./styles.js";
import DisplayEatery from "../../../components/Vouchers/DisplayEatery";
import { Typography, Grid, Link } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import { getAvaliableVouchers } from "../../../actions/vouchers.js";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../redux/slices/page.slice";
import { useHistory } from "react-router-dom";
import "../../../assets/style.css";

const Eatery = (props) => {
  const classes = useStyles();
  const { eatery } = props.history.location.state;
  const { token } = useSelector(state => (state.auth));
  const dispatch = useDispatch();
  const [vouchers, setVouchers] = useState([]);
  const [isloading, setIsloading] = useState(false);
  
  //calls API to get Vouchers from backend
  const getVouchers = async () => {
    try {
      const avaliable = await getAvaliableVouchers(eatery.owner);
      setVouchers(avaliable.data.released);
      return;
    } catch (error) {
      console.log(error.response);
      setVouchers([]);
      return error.response;
    }
  };

  // Navigates to reviews page also passing the eatery state
  let history = useHistory();
  const handleClickReviews = () => {
    if (token !== "") {
      history.push({
        pathname: "/eatery/" + eatery.name + "/reviews",
        state: { eatery: eatery },
      });
    } else {
      history.push({
          pathname: "/auth/login"
      });
      dispatch(setPage(-1));
    }
  };

  
  // Navigates to profile page also passing the eatery state
  const handleClickProfile = () => {
    history.push({
      pathname: "/eatery/" + eatery.name + "/profile",
      state: { eatery: eatery },
    });
  };

  useEffect(() => {
    getVouchers();
    setIsloading(true);
  }, []);

  // Render vouchers
  let vouchersToRender;
  if (vouchers) {
    let voucherList = [];
    for (let i = 0; i < vouchers.length; i++) {
      let endDate = new Date(vouchers[i].endDateTime);
      let nowDate = new Date();
      // checks if the voucher has expired or not to add to the list
      if (endDate > nowDate) {
        if (eatery.voucherInstanceIds) {
          if (eatery.voucherInstanceIds.includes(vouchers[i]._id))
            voucherList.push(vouchers[i]);
        } else {
          voucherList.push(vouchers[i]);
        }
      }
    }

    vouchersToRender = voucherList.map((voucher) => (
      <div>
        <DisplayEatery voucher={voucher} eateryId={eatery.owner} />
      </div>
    ));
  }

  return isloading ? (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={(classes.title, classes.font)}>
            <Grid container className={classes.container} direction="row">
              <Grid item xs>
              <Link
                    onClick={handleClickProfile}
                    style={{
                      cursor: "pointer",
                      color: "green",
                      marginRight: "10px",
                    }}
                    className={classes.name}
                  >{eatery.name}</Link>
              </Grid>
              <Grid item xs={3}>
                <div className={classes.reviews}>
                  <StarIcon
                    className={classes.icon}
                    style={{ color: "orange" }}
                  />
                  <Link
                    onClick={handleClickReviews}
                    style={{
                      cursor: "pointer",
                      color: "green",
                      marginRight: "10px",
                    }}
                  >{`Reviews (${
                    Math.round(eatery.reviewRating * 100) / 100
                  })`}</Link>
                </div>
              </Grid>
            </Grid>
            <Typography>Address: {eatery.address}</Typography>
          </div>
          <div className={classes.font}>
            <p className={classes.voucherHeader}>Vouchers</p>
            <div>{vouchersToRender}</div>
          </div>
        </div>
        <div className={classes.column}>
          <img className={classes.menu} src={eatery.menu} alt="menu" />
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default Eatery;
