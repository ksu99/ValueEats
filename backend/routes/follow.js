const express = require('express');

const router = express.Router();

const { follow, unfollow, getFollow } = require('../controllers/follow');

router.put('/feed/follow', follow);
router.put('/feed/unfollow', unfollow);
router.get('/feed/getFollow', getFollow);

module.exports = router;
