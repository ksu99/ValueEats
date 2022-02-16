import User from "../models/user";
import Restaurant from "../models/restaurant";
import Review from "../models/review";
import VoucherCode from "../models/voucherCode";
import LikedReview from "../models/likedReview";

import jwt from "jsonwebtoken";

const getReviewerInfo = async (reviewerId, res) => {
  const reviewer = await User.findOne({ _id: reviewerId })
    .exec()
    .catch((_) => res.status(400).send("Invalid eatery id"));

  return reviewer;
};

const getRestaurantInfo = async (restaurantId, res) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId })
    .exec()
    .catch((_) => res.status(400).send("Invalid restaurant id"));

  return restaurant;
};

const findNumberOfReview = (reviewerId, reviews) => {
  let count = 0;
  reviews.map((review) => {
    count =
      review.diner.toString() === reviewerId.toString() ? count + 1 : count;
  });
  return count;
};

const findNumberOfRedeem = async (reviewerId, ownerId) => {
  const voucherCodes = await VoucherCode.find({
    diner: reviewerId,
    isRedeem: true,
    eatery: ownerId,
  }).exec();

  return voucherCodes.length;
};

const findReviews = async (restaurantId) => {
  const reviews = await Review.find({ restaurant: restaurantId })
    .lean();
  return reviews;
};

const calculateNumReviewLeft = async (reviewerId, ownerId, reviews) => {
  const numberOfReview = findNumberOfReview(reviewerId, reviews);
  const numberOfRedeem = await findNumberOfRedeem(reviewerId, ownerId);
  console.log("num diner review", numberOfReview);
  console.log("num diner redeem", numberOfRedeem);

  return numberOfRedeem - numberOfReview;
};

const calculateRatingAverage = (reviews) => {
  let totalRating = 0;
  reviews.map((review) => (totalRating += review.rating));
  return totalRating;
};

const createReview = async (req, res) => {
  try {
    const { reviewerId, restaurantId, rating, review } = req.body;

    console.log(reviewerId);
    const reviewer = await getReviewerInfo(reviewerId, res);
    const restaurant = await getRestaurantInfo(restaurantId, res);
    // Validations - the reviewer must be a diner and have redeem the restaurant at least one.
    if (!reviewer.isDiner)
      return res.status(400).send("Reviewer must be a diner");

    const reviews = await findReviews(restaurantId);

    const numberOfReviewLeft = await calculateNumReviewLeft(
      reviewerId,
      restaurant.owner,
      reviews
    );

    if (numberOfReviewLeft === 0)
      return res
        .status(400)
        .send(
          "You have no review actions left, please redeem at least one to enable review action"
        );

    if (!rating) return res.status(400).send("A rating is required");
    if (!review) return res.status(400).send("A review is required");

    const sumRatingOfRestaurant = restaurant.reviewRating * reviews.length;
    const newReviewRating =
      (sumRatingOfRestaurant + rating) / (reviews.length + 1);

    restaurant.reviewRating = newReviewRating;
    await restaurant.save();

    const mongoReview = await new Review({
      diner: reviewerId,
      eatery: restaurant.owner,
      restaurant: restaurantId,
      rating: rating,
      review: review,
    }).save();

    return res.json({ review: mongoReview });
  } catch (err) {
    console.log("CREATE REVIEW FAILED", err);
    return res.status(400).send("Failed to create review. Please try again");
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewerId, reviewId, updatedReview, updatedRating } = req.body;

    const review = await Review.findOne({ _id: reviewId }).exec();

    // Validation
    if (review.diner.toString() !== reviewerId)
      return res
        .status(400)
        .send("Unauthorized reviewer for updating this review");
    if (!updatedReview || !updatedRating) {
      return res.status(400).send("A review and a rating are required");
    }

    if (review.rating !== updatedRating) {
      console.log("Update average review rating for the restaurant");
      const oldRating = review.rating;
      const reviews = await findReviews(review.restaurant);

      const restaurant = await Restaurant.findOne({
        _id: review.restaurant,
      }).exec();
      const newReviewRating =
        restaurant.reviewRating + (-oldRating + updatedRating) / reviews.length;

      restaurant.reviewRating = newReviewRating;
      await restaurant.save();
    }

    review.review = updatedReview;
    review.rating = updatedRating;

    await review.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log("UPDATE REVIEW FAILED", err);
    return res.status(400).send("Failed to update review");
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewerId, reviewId } = req.body;
    const review = await Review.findOne({ _id: reviewId }).exec();

    // Validation
    if (!review) return res.status(400).send("The review is not exist");
    if (review.diner.toString() !== reviewerId)
      return res
        .status(400)
        .send("Unauthorized reviewer for updating this review");

    await Review.deleteOne({ _id: reviewId }, (err, _) => {
      if (err) {
        console.log("Failed to delete the review", err);
        return res.status(400).send("Failed to delete the review");
      }
    });
    // after deleting the review => updating the review rating of the restaurant the review belongs to
    const reviews = await findReviews(review.restaurant);
    if (reviews.length === 0) {
      return res.json({ ok: true });
    }
    const restaurant = await getRestaurantInfo(review.restaurant);
    const sumReviewRating = restaurant.reviewRating * (reviews.length + 1);
    const newReviewRating = (sumReviewRating - review.rating) / reviews.length;
    restaurant.reviewRating = newReviewRating;
    await restaurant.save();

    await LikedReview.deleteMany({ review: reviewId }, (err, _) => {
      if (err) {
        console.log("Failed to delete the likes", err);
        return res.status(400).send("Failed to delete like");
      }
    });

    //const restaurantValidation = await getRestaurantInfo(review.restaurant);
    //console.log('validation restaurant in delete review ', restaurantValidation);
    return res.json({ ok: true });
  } catch (err) {
    console.log("DELETE REVIEW FAILED", err);
    return res.status(400).send("Failed to delete review. Please try again");
  }
};

const getReview = async (req, res) => {
  try {
    const reviewerId = req.query.reviewerId;
    const restaurantId = req.query.restaurantId;

    const reviewer = await getReviewerInfo(reviewerId, res);
    const restaurant = await getRestaurantInfo(restaurantId, res);

    console.log(restaurant);
    // get all reviews for the restaurant
    const reviews = await findReviews(restaurantId);
    if (reviews.length === 0) {
      return res.json({ reviews: [] });
    }
    const averageRating = calculateRatingAverage(reviews) / reviews.length;
    restaurant.reviewRating = averageRating;
    await restaurant.save();

    const mapReviews = new Map();

    await Promise.all(reviews.map(async (review) => {
      review.isLiked = false;
      mapReviews.set(review._id.toString(), review);
      const diner = await getReviewerInfo(review.diner, res);
      review.diner = {
        _id: diner._id,
        name: `${diner.firstName} ${diner.lastName}`,
        email: diner.email,
        profilePicture: diner.profilePicture,
      };
      review.restaurant = restaurant;
    }));

    // Construct response object
    const responseObject = { reviews, averageRating };

    if (reviewer.isDiner) {
      responseObject.numberOfReviewLeft = await calculateNumReviewLeft(
        reviewerId,
        restaurant.owner,
        reviews
      );

      const likedReviews = await LikedReview.find({
        reviewer: reviewerId,
      }).exec();
      likedReviews.map((likedReview) => {
        if (mapReviews.get(likedReview.review.toString())) {
          mapReviews.get(likedReview.review.toString()).isLiked = true;
        }
      });
    }

    const restaurant2 = await getRestaurantInfo(restaurantId, res);
    console.log(restaurant2);

    return res.json(responseObject);
  } catch (err) {
    console.log("GET REVIEW FAILED", err);
    return res.status(400).send("Failed to get review. Please try again");
  }
};

const likeReview = async (req, res) => {
  try {
    const { reviewerId, reviewId } = req.body;

    const likedReviews = await LikedReview.find({
      reviewer: reviewerId,
      review: reviewId,
    }).exec();

    if (likedReviews.length === 0) {
      await new LikedReview({ reviewer: reviewerId, review: reviewId }).save(
        (err, _) => {
          if (err)
            return res
              .status(400)
              .send("Can not save like review in the database");
        }
      );
      const review = await Review.findOne({ _id: reviewId }).exec();
      review.likes++;
      await review.save();
      return res.status(200).send("The reviewer like the review successfully");
    }

    return res.status(400).send("The reviewer already like this review");
  } catch (err) {
    console.log("LIKEREVIEW FAILED", err);
    return res.status(400).send("Failed to like review. Please try again");
  }
};

const unlikeReview = async (req, res) => {
  try {
    const { reviewerId, reviewId } = req.body;

    await LikedReview.deleteOne(
      { reviewer: reviewerId, review: reviewId },
      async (err, result) => {
        if (err) {
          console.log("Failed to unlike the review", err);
          return res.status(400).send("Failed to unlike the review");
        }
        console.log("deleted likedReviews ", result);
        if (result.deletedCount === 1) {
          const review = await Review.findOne({ _id: reviewId }).exec();
          review.likes--;
          await review.save();
        }
        return res.json({ ok: true });
      }
    );
  } catch (err) {
    console.log("LIKE REVIEW FAILED", err);
    return res.status(400).send("Failed to like review. Please try again");
  }
};

module.exports = {
  getReview,
  createReview,
  updateReview,
  likeReview,
  unlikeReview,
  deleteReview,
};
