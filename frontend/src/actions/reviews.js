import axios from "axios";

// router.get('/review/get-review', getReview);
// const reviewerId = req.query.reviewerId;
// const restaurantId = req.query.restaurantId
export const getReviews = async (id) => {
  return axios.get(`${process.env.REACT_APP_API}/review/get-review`, {
    params: id,
  });
};

// router.post('/review/create-review', createReview);
// const { reviewerId, restaurantId, rating, review } = req.body;
export const createReview = async (data) => {
  return axios.post(`${process.env.REACT_APP_API}/review/create-review`, data);
};

// router.put('/review/update-review', updateReview);
// const { reviewerId, reviewId, updatedReview, updatedRating } = req.body;
export const updateReview = async (data) => {
  return axios.put(`${process.env.REACT_APP_API}/review/update-review`, data);
};

// router.put('/review/delete-review', deleteReview);
// const { reviewerId, reviewId } = req.body;
export const deleteReview = async (data) => {
  return axios.put(`${process.env.REACT_APP_API}/review/delete-review`, data);
};

// router.post('/review/like-review', likeReview);
// const { reviewerId, reviewId } = req.body;
export const likeReview = async (data) => {
  return axios.post(`${process.env.REACT_APP_API}/review/like-review`, data);
};

// router.put('/review/unlike-review', unlikeReview);
// const { reviewerId, reviewId } = req.body;
export const unlikeReview = async (data) => {
  return axios.put(`${process.env.REACT_APP_API}/review/unlike-review`, data);
};
