import axios from "axios";

export const getRestaurantPost = async (userId) => {
  return axios.get(`${process.env.REACT_APP_API}/post/getRestaurant`, {
    params: { userId },
  });
};

// router.post('/post/write', writePost);
// const writePost = async (req, res) => {
//   try {
//     const { userId, content, image } = req.body;
export const writePost = async (data) => {
  return axios.post(`${process.env.REACT_APP_API}/post/write`, data);
};

// router.get('/post/getFromFollowers', getPostFromFollowers);
// const getPostFromFollowers = async (req, res) => {
//   try {
//     const dinerId = req.query.dinerId;
export const getPostFromFollowers = async (dinerId) => {
  return axios.get(`${process.env.REACT_APP_API}/post/getFromFollowers`, {
    params: { dinerId },
  });
};

// router.delete('/post/delete', deletePost);
// const deletePost = async (req, res) => {
//   try {
//     const postId = req.query.postId;
//     const userId = req.query.userId;
export const deletePost = async (postId, userId) => {
  return axios.delete(`${process.env.REACT_APP_API}/post/delete`, {
    params: { postId, userId },
  });
};

// router.put('/post/update', updatePost);
// const updatePost = async (req, res) => {
//   try {
// const postId = req.body.postId;
// const userId = req.body.userId;
// const contentString = req.body.content;
// const contentImage = req.body.image;
export const updatePost = async (postId, userId, content, image) => {
  return axios.put(`${process.env.REACT_APP_API}/post/update`, {
    postId,
    userId,
    content,
    image,
  });
};
