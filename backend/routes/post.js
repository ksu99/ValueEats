const express = require('express');

const router = express.Router();

const {
  writePost,
  getRestaurantPost,
  getPostFromFollowers,
  deletePost,
  updatePost,
} = require('../controllers/post');

router.post('/post/write', writePost);
router.get('/post/getRestaurant', getRestaurantPost);
router.get('/post/getFromFollowers', getPostFromFollowers);
router.delete('/post/delete', deletePost);
router.put('/post/update', updatePost);

module.exports = router;
