const express = require('express');

const router = express.Router();

const { createReview, getReview, updateReview, deleteReview, likeReview, unlikeReview } = require('../controllers/review');

//const { requireLogin } = require('../middlewares');

router.get('/review/get-review', getReview);
router.post('/review/create-review', createReview);
router.put('/review/update-review', updateReview);
router.put('/review/delete-review', deleteReview);
router.post('/review/like-review', likeReview);
router.put('/review/unlike-review', unlikeReview);

module.exports = router;
