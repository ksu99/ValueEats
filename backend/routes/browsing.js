const express = require('express');

const router = express.Router();

const {
  browseRestaurantByName,
  browseRestaurantKeyWord,
  browseByFilterByCuisine,
  browseByFilterByLocation,
  browseByFilterByTime,
} = require('../controllers/browsing');

router.get('/browse/name', browseRestaurantByName);
router.get('/browse/', browseRestaurantKeyWord);
router.get('/browse/cuisine', browseByFilterByCuisine);
router.get('/browse/location', browseByFilterByLocation);
router.get('/browse/time', browseByFilterByTime);

module.exports = router;
