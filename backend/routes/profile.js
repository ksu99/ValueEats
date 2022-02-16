const express = require('express');

const router = express.Router();

const {
  profileUpdate,
  userReview,
  getVouchers,
  eateryReview,
} = require('../controllers/profile');
const { requireLogin } = require('../middlewares');

router.put('/profile/update', requireLogin, profileUpdate);
router.get('/profile/review', requireLogin, userReview);
router.get('/profile/oldreview', eateryReview);
router.get('/profile/voucher', getVouchers);

module.exports = router;
