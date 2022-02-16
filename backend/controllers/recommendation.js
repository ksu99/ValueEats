import User from "../models/user";
import Restaurant from "../models/restaurant";
import VoucherCode from "../models/voucherCode";
import Follow from "../models/follow";
import axios from "axios";
const mongoose = require("mongoose");
const { findAvailQuantities } = require("./browsing");

const MAX_RANGE = 10;

const getUserInfo = async (userId, res) => {
  const user = await User.findOne({ _id: userId })
    .exec()
    .catch((_) => res.status(400).send("Invalid eatery id"));

  return user;
};

const getVisitedRestaurant = async (userId) => {
  const bookedRestList = await VoucherCode.aggregate([
    { $match: { diner: { $eq: mongoose.Types.ObjectId(userId) } } },
    {
      $lookup: {
        from: Restaurant.collection.name,
        localField: "eatery",
        foreignField: "owner",
        as: "restaurant",
      },
    },
    { $unwind: "$restaurant" },
    { $group: { _id: "$_id", restaurantId: { $addToSet: "$restaurant._id" } } },
    { $unwind: "$restaurantId" },
  ]);

  const listRestId = bookedRestList.map((each) => each.restaurantId.toString());
  const setRestId = new Set(listRestId);

  console.log(setRestId);

  return setRestId;
};

const getTopTenRatingRest = async (setBookedRestIds) => {
  const topTen = await Restaurant.find({})
    .sort({ reviewRating: -1 })
    .limit(10)
    .exec();

  const notBookedRestsTopRating = [];
  topTen.map((each) => {
    if (!setBookedRestIds.has(each._id.toString())) {
      notBookedRestsTopRating.push(each);
    }
  });

  return notBookedRestsTopRating;
};

const getRestsHaveCommonCuisines = async (cuisines, setBookedRestIds) => {
  console.log("cuisines from getRestsHaveCommonCuisines ", cuisines);
  const ownersHaveCommonCuisines = await User.aggregate([
    { $match: { isDiner: { $eq: false } } },
    { $unwind: "$cuisines" },
    { $match: { cuisines: { $in: cuisines } } },
    {
      $lookup: {
        from: Restaurant.collection.name,
        localField: "_id",
        foreignField: "owner",
        as: "restaurant",
      },
    },
    { $unwind: "$restaurant" },
    { $group: { _id: "$_id", restaurant: { $addToSet: "$restaurant" } } },
    { $unwind: "$restaurant" },
  ]);

  const notBookedRestsHaveCommonCuisines = [];
  ownersHaveCommonCuisines.map((each) => {
    if (!setBookedRestIds.has(each.restaurant._id.toString())) {
      notBookedRestsHaveCommonCuisines.push(each.restaurant);
    }
  });

  return notBookedRestsHaveCommonCuisines;
};

const getRestsWithinMaxRange = async (userPostcode, setBookedRestIds) => {
  const allRests = await Restaurant.find({}).lean();
  const userLatAndLonResponse = await axios.get(
    `http://v0.postcodeapi.com.au/suburbs/${userPostcode}.json`
  );
  const userLatAndLon = userLatAndLonResponse.data[0];

  await Promise.all(
    allRests.map(async (each) => {
      const restPostcode = each.postcode;
      const restLatAndLon = await axios.get(
        `http://v0.postcodeapi.com.au/suburbs/${restPostcode}.json`
      );
      each.latitude = restLatAndLon.data[0].latitude;
      each.longitude = restLatAndLon.data[0].longitude;
    })
  );

  const notBookedRestsWithinMaxRange = [];

  allRests.map((each) => {
    const distance = Math.floor(
      getDistanceFromLatLonInKm(
        userLatAndLon.latitude,
        userLatAndLon.longitude,
        each.latitude,
        each.longitude
      )
    );
    if (distance <= MAX_RANGE && !setBookedRestIds.has(each._id.toString())) {
      console.log("distance from user address", distance);
      notBookedRestsWithinMaxRange.push(each);
    }
  });

  return notBookedRestsWithinMaxRange;
};

const getRestsFromFollowingList = async (userId, setBookedRestIds) => {

  console.log("following List: ", userId);

  const restsFromFollowingList = await Follow.aggregate([
    { $unwind: "$followers" },
    { $match: { followers: { $eq: userId } } },
    {
      $lookup: {
        from: Restaurant.collection.name,
        localField: "owner",
        foreignField: "owner",
        as: "restaurant",
      },
    },
    { $unwind: "$restaurant" },
    { $group: { _id: "$_id", restaurant: { $addToSet: "$restaurant" } } },
    { $unwind: "$restaurant" },
  ]);

  const notBookedRestsFromFollowingList = [];
  restsFromFollowingList.map((each) => {
    if (!setBookedRestIds.has(each.restaurant._id.toString())) {
      notBookedRestsFromFollowingList.push(each.restaurant);
    }
  });

  console.log("rests from following list", restsFromFollowingList);
  return notBookedRestsFromFollowingList;
};

const getRecommendation = async (req, res) => {
  const userId = req.query.userId;
  const user = await getUserInfo(userId, res);
  console.log(user.postcode);

  const setBookedRestIds = await getVisitedRestaurant(userId);
  let notBookedRestsTopRating = await getTopTenRatingRest(setBookedRestIds);
  let notBookedRestsHaveCommonCuisines = await getRestsHaveCommonCuisines(
    user.cuisines,
    setBookedRestIds
  );
  let notBookedRestsWithinMaxRange = await getRestsWithinMaxRange(
    user.postcode,
    setBookedRestIds
  );
  let notBookedRestsFromFollowingList = await getRestsFromFollowingList(
    userId,
    setBookedRestIds
  );

  // remove all duplicated restaurant accross each type of recommendation
  const mapAllRecommendedRests = {};

  let recommendedRests = notBookedRestsTopRating
    .concat(notBookedRestsHaveCommonCuisines)
    .concat(notBookedRestsWithinMaxRange)
    .concat(notBookedRestsFromFollowingList);

  recommendedRests.map((each) => {
    mapAllRecommendedRests[each._id.toString()] = each;
  });

  recommendedRests = [];
  for (const key in mapAllRecommendedRests) {
    recommendedRests.push(mapAllRecommendedRests[key]);
  }

  recommendedRests = await findAvailQuantities(recommendedRests);
  notBookedRestsTopRating = await findAvailQuantities(notBookedRestsTopRating);
  notBookedRestsHaveCommonCuisines = await findAvailQuantities(
    notBookedRestsHaveCommonCuisines
  );
  notBookedRestsWithinMaxRange = await findAvailQuantities(
    notBookedRestsWithinMaxRange
  );
  notBookedRestsFromFollowingList = await findAvailQuantities(
    notBookedRestsFromFollowingList
  );

  // console.log(recommendedRests)
  return res.json({
    all: recommendedRests,
    topRating: notBookedRestsTopRating,
    commonCuisines: notBookedRestsHaveCommonCuisines,
    nearbyLocation: notBookedRestsWithinMaxRange,
    followingList: notBookedRestsFromFollowingList,
  });
};

/*
 * Stack Overflow. (n.d.). javascript - Function to calculate distance between two coordinates.
 * [online] Available at: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates [Accessed 24 Jul. 2021].
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

module.exports = {
  getRecommendation,
};
