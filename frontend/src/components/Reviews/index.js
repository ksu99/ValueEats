import "./styles.css";
import React, { useState, useEffect } from "react";
import SingleReview from "../UserProfile/SingleReviews";
import { useSelector } from "react-redux";
import { getReviews } from "../../actions/reviews";
import { eateryReview } from "../../actions/profile";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddReview from "../AddReview";
import Rating from "@material-ui/lab/Rating";

const Reviews = (props) => {
  var eatery;
  const [loading, setLoading] = useState(false);
  const [addReview, toggleAddReview] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const { token, user } = useSelector((state) => state.auth);
  if (props.profile) {
    eatery = user;
  } else {
    eatery = props.history.location.state.eatery;
  }

  useEffect(() => {
    const fetch = async () => {
      let response = [];
      if (!props.profile) {
        response = await getReviews({
          reviewerId: user._id,
          restaurantId: eatery._id,
        });
      } else {
        response = await eateryReview(token, { userId: user._id });
      }
      if (response.data) {
        setReviewData(response.data);
        setLoading(true);
      }
    };
    fetch();
  }, [token, user]);

  return (
    <div className="all-reviews-box">
      <div className="reviews-restaurant">
        <div>
          {eatery.name ||
            eatery.restaurantName ||
            eatery.firstName + " " + eatery.lastName}{" "}
          Reviews
        </div>
        <div style={{ color: "grey", fontSize: 20, display: "flex" }}>
          {reviewData.averageRating && (
            <>
              {`${reviewData.averageRating.toFixed(1)}`}
              <Rating
                style={{
                  display: "flex",
                  justifySelf: "center",
                  alignSelf: "center",
                }}
                value={reviewData.averageRating.toFixed(2)}
                precision={0.5}
                readOnly
              />
            </>
          )}
        </div>
      </div>
      <div className="reviews-header">
        <div className="reviews-add">
          {eatery.name ? (
            <>
              <AddCircleOutlineIcon
                style={{ fontSize: 40, cursor: "pointer" }}
                onClick={() => toggleAddReview(!addReview)}
              />
              Add a review
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
      {addReview && (
        <AddReview
          user={user}
          eatery={eatery}
          onCancel={() => toggleAddReview(false)}
        />
      )}
      {loading && (
        <div className="all-reviews-container">
          {reviewData.reviews.length === 0 && <>No reviews</>}
          {reviewData.reviews.map((review) => (
            <>
              <SingleReview review={review} profile={props.profile} />
              <div style={{ margin: 20 }} />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
