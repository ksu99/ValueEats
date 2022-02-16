const express = require('express');

const router = express.Router();

const { getRecommendation }  = require('../controllers/recommendation');

router.get('/recommendation/get-recommendation', getRecommendation);

module.exports = router;
