import React, { useState, useEffect } from "react";
import "./styles.css";
import { createReview, updateReview } from "../../actions/reviews";
import { toast } from "react-toastify";
import Card from "@material-ui/core/Card";
import { FilledButton } from "../General/button";
import Rating from "@material-ui/lab/Rating";
import { ClickAwayListener } from "@material-ui/core";

const AddReview = (props) => {
  const { user, onCancel, edit, centered } = props;
  const { firstName, lastName, email, _id } = user;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (edit) {
      setRating(props.rating);
      setReview(props.review);
    }
  }, []);

  const handleSubmit = () => {
    if (!edit) {
      createReview({
        reviewerId: _id,
        restaurantId: centered ? props.eatery.restaurantId : props.eatery._id,
        rating,
        review,
      })
        .then((response) => {
          console.log(response);
          onCancel();
          window.location.reload();
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            toast.error(err.response.data);
          }
        });
    } else {
      updateReview({
        reviewerId: _id,
        reviewId: props.reviewId,
        updatedReview: review,
        updatedRating: rating,
      })
        .then((response) => {
          console.log(response);
          window.location.reload();
          onCancel();
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            toast.error(err.response.data);
          }
        });
    }
  };

  return (
    <ClickAwayListener onClickAway={onCancel}>
      <Card style={{ width: "80%", padding: centered && 10 }}>
        <div className="add-reviews-container">
          <div className="add-reviews-header">
            <div className="add-reviews-user">
              <img
                src={user.profilePicture}
                alt="profile-pic"
                style={{ marginRight: 10, height: 50, borderRadius: "100%" }}
              />
              <div className="add-reviews-name">
                <div>{firstName + " " + lastName}</div>
                <div style={{ color: "grey" }}>{email}</div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <Rating
                style={{
                  display: "flex",
                  justifySelf: "center",
                  alignSelf: "center",
                }}
                value={rating}
                onClick={(e) => setRating(e.target.value)}
              />
            </div>
          </div>
          <div className="add-reviews-input">
            <textarea
              maxLength={500}
              onChange={(e) => setReview(e.target.value)}
              value={review}
            />
          </div>
          <div className="add-reviews-footer">
            <FilledButton
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={onCancel}
            >
              Cancel
            </FilledButton>
            <FilledButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </FilledButton>
          </div>
        </div>
      </Card>
    </ClickAwayListener>
  );
};

export default AddReview;
