import "./styles.css";
import React, { useState } from "react";
import { StyledFavouriteBorderIcon, StyledFavouriteIcon } from "./styles";
import { useSelector } from "react-redux";
import {
  likeReview,
  unlikeReview,
  deleteReview,
} from "../../../actions/reviews";
import AddReview from "../../AddReview";
import StarIcon from "@material-ui/icons/Star";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";
import Card from "@material-ui/core/Card";

const renderRating = (rating) => {
  let stars = new Array(rating).fill(0);
  let nullStars = new Array(5 - rating).fill(0);
  return (
    <>
      {stars.map(() => (
        <StarIcon style={{ color: "orange" }} />
      ))}
      {nullStars.map(() => (
        <StarIcon style={{ color: "lightgrey" }} />
      ))}
    </>
  );
};

const SingleReviews = (props) => {
  const {
    diner,
    eatery,
    restaurant,
    isLiked,
    likes,
    rating,
    review,
    createdAt,
    _id,
  } = props.review;
  const { user } = useSelector((state) => state.auth);
  const [edit, toggleEdit] = useState(false);
  const [like, toggleLike] = useState({ label: isLiked, value: likes });

  const handleDelete = () => {
    deleteReview({ reviewerId: user._id, reviewId: _id })
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      });
  };
  console.log(isLiked);
  const handleLike = () => {
    if (like.label) {
      unlikeReview({ reviewerId: user._id, reviewId: _id });
      toggleLike({ ...like, label: false, value: like.value - 1 });
    } else {
      likeReview({ reviewerId: user._id, reviewId: _id });
      toggleLike({ ...like, label: true, value: like.value + 1 });
    }
  };

  console.log(props);

  return edit ? (
    <AddReview
      edit
      review={review}
      rating={rating}
      reviewId={_id}
      onCancel={() => toggleEdit(false)}
      user={user}
    />
  ) : (
    <Card style={{ width: "100%" }} elevation={5}>
      <div className="review-box">
        <div className="review-header">
          <div className="review-user">
            <img
              src={
                props.profile && user.isDiner
                  ? eatery.profilePicture
                  : diner.profilePicture
              }
              alt="profile-pic"
              style={{
                marginRight: 10,
                height: 50,
                width: 50,
                borderRadius: "100%",
              }}
            />
            <div>
              <div className="review-name">
                {props.profile && user.isDiner ? restaurant.name : diner.name}
              </div>
              <div className="review-email">
                {props.profile && user.isDiner
                  ? restaurant.address
                  : diner.email}
              </div>
            </div>
          </div>
          <div className="review-rating">
            <div>
              {user._id === diner._id && (
                <>
                  <EditIcon
                    className="review-icon-button"
                    style={{
                      margin: "0 10px",
                      cursor: "pointer",
                      color: "DarkSlateGray",
                    }}
                    onClick={() => toggleEdit(!edit)}
                  />
                  <DeleteIcon
                    className="review-icon-button"
                    style={{ cursor: "pointer", color: "FireBrick" }}
                    onClick={handleDelete}
                  />
                </>
              )}
            </div>
            <div>{renderRating(rating)}</div>
          </div>
        </div>
        <div className="review-container">{review}</div>
        <div className="review-footer">
          <div className="review-likes">
            {like.label ? (
              <StyledFavouriteIcon
                className="unlike-button"
                onClick={handleLike}
              />
            ) : (
              <StyledFavouriteBorderIcon
                className="like-button"
                onClick={handleLike}
              />
            )}
            {like.value} likes
          </div>
          <div>{createdAt.substring(0, 10)}</div>
        </div>
      </div>
    </Card>
  );
};

export default SingleReviews;
