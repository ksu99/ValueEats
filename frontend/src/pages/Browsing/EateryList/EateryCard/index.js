import { React } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../../redux/slices/page.slice";
import Rating from "@material-ui/lab/Rating";
import { useHistory } from "react-router-dom";
import "./styles.css";

const EateryCard = (props) => {
  const { eatery } = props;
  const { token } = useSelector(state => (state.auth));
  const dispatch = useDispatch();

  let history = useHistory();
  const handleClickProfile = (props) => {
    history.push({
      pathname: "/eatery/" + eatery.name + "/profile",
      state: { eatery: eatery },
    });
  };
  const handleClickVoucher = (props) => {
    history.push({
      pathname: "/eatery/" + eatery.name + "/vouchers",
      state: { eatery: eatery },
    });
  };

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

  return (
    <div className="eatery-card-container">
      <Card className="eatery-card" elevation={5}>
        <CardActionArea
          className="eatery-card-content"
          onClick={handleClickProfile}
        >
          <CardMedia
            id="eatery-media"
            className="eatery-media"
            component="image"
            image={eatery.restaurantPicture}
            onClick={handleClickProfile}
          />
        </CardActionArea>
        <div className="eatery-details-container">
          <CardContent className="eatery-card-description">
            <div className="eatery-title-review">
              <Typography
                className="eatery-title"
                gutterBottom
                variant="h4"
                onClick={handleClickProfile}
              >
                {eatery.name}
              </Typography>
              <div className="eatery-review">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="rating-reviews"
                >
                  {eatery.reviewRating}
                </Typography>
                <Rating value={eatery.reviewRating} precision={0.5} readOnly />
              </div>
              <div className="eatery-address">{eatery.address}</div>
            </div>
            <div className="eatery-description">{eatery.description}</div>
          </CardContent>
          <CardActions className="eatery-card-buttons">
            <Button
              className="eatery-voucher-button"
              size="small"
              color="primary"
              onClick={handleClickVoucher}
            >
              Vouchers {/*add link to vouchers booking component @ tien*/}
            </Button>
            <Button
              className="eatery-review-button"
              size="small"
              color="primary"
              onClick={handleClickReviews}
            >
              Reviews {/* add link to eatery reviews component @ calvin*/}
            </Button>
          </CardActions>
        </div>
      </Card>
    </div>
  );
};

export default EateryCard;
