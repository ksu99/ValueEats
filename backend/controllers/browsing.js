import User from "../models/user";
import Restaurant from "../models/restaurant";
import Voucher from "../models/voucher";
import VoucherInstance from "../models/voucherInstance";
const mongoose = require('mongoose');


const findAvailQuantities = async (restaurantList) => {
  const mapRestaurants = new Map();
  const restaurantIdList = restaurantList.map(rest => {
    if (typeof rest._id === 'string') {
      rest._id = mongoose.Types.ObjectId(rest._id);
    }
    rest.reviewRating = parseFloat(rest.reviewRating.toFixed(2));
    rest.availableQuantity = 0;
    mapRestaurants.set(rest._id.toString(), rest);
    return rest._id
  });

  const currentTime = new Date();
  const result = await Restaurant.aggregate([
    { '$match': { '_id': { '$in': restaurantIdList } } },
    {
      '$lookup': {
        'from': Voucher.collection.name,
        'localField': 'owner',
        'foreignField': 'createdBy',
        'as': 'voucher'
      }
    },
    { '$unwind': '$voucher' },
    {
      '$lookup': {
        'from': VoucherInstance.collection.name,
        'localField': 'voucher._id',
        'foreignField': 'voucher',
        'as': 'voucherinstance'
      }
    },
    { '$unwind': '$voucherinstance' },
    { '$match': { 'voucherinstance.endDateTime': { $gte: currentTime } } },
    { '$sort': { 'voucherinstance.startDateTime': 1 } },
    {
      '$project': {
        _id: 1,
        'voucherinstance.availableQuantity': 1,
        'voucherinstance.startDateTime': 1,
      }
    }
  ])

  console.log(result);

  result.map(each => {
    const restaurant = mapRestaurants.get(each._id.toString());
    console.log(each.voucherinstance.availableQuantity);
    restaurant.availableQuantity += each.voucherinstance.availableQuantity;
  })
  return restaurantList.sort((a, b) => parseFloat(b.availableQuantity) - parseFloat(a.availableQuantity));
}

// User Story 4.1
// A diner will search a restaurant by the restaurant name, and
// this route should return the user object of the restaurant
// and the restaurant object.
const browseRestaurantByName = async (req, res) => {
  try {
    var restaurant = {};
    const restaurantName = req.query.name;

    const restaurantFilter = { name: restaurantName };

    const restaurantObject = await Restaurant.findOne(restaurantFilter).exec();

    if (restaurantObject) {
      restaurant = JSON.parse(JSON.stringify(restaurantObject));
      const userFilter = { _id: restaurantObject.owner };
      const userObject = await User.findOne(userFilter).exec();
      if (userObject) {
        restaurant.cuisines = userObject.cuisines;
        console.log("Successfully searched for restaurant");
        return res.json(restaurant);
      } else {
        console.log("Could not find user of restaurant");
      }
    } else {
      console.log("Could not find restaurant");
      return res.json();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("ERROR could not search for restaurant");
  }
};

// Browse by keyword
// A diner will search for restaurants by a keyword, and this
// route will return all restaurant user objects with the keyword
const browseRestaurantKeyWord = async (req, res) => {
  try {
    const restaurants = [];
    const keyword = req.query.keyword;
    const keywordFilter = { name: { $regex: keyword, $options: "i" } };
    const restaurantsFound = await Restaurant.find(keywordFilter).exec();

    if (restaurantsFound) {
      for (var i = 0; i < restaurantsFound.length; i++) {
        const ownerID = restaurantsFound[i].owner;
        const ownerFilter = { _id: ownerID };
        const ownerObject = await User.findOne(ownerFilter).exec();
        const restaurantObject = JSON.parse(
          JSON.stringify(restaurantsFound[i])
        );
        restaurantObject.cuisines = ownerObject.cuisines;
        restaurants.push(restaurantObject);
      }

      console.log(restaurants);
      const result = await findAvailQuantities(restaurants);
      return res.json(result);
    } else {
      console.log("Could not search restaurant");
      return res.status(400).send("Could not search restaurant");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Could not execute keyword search");
  }
};

// Browse Restaurant by category (filter)
const browseByFilterByCuisine = async (req, res) => {
  try {
    const restaurants = [];
    const filterArray = req.query.filter;
    let filter = {};
    if (filterArray === "all") {
      filter = { isDiner: false };
    } else {
      filter = { cuisines: { $all: filterArray }, isDiner: false };
    }
    // const filter = { cuisines: { $all: filterArray }, isDiner: false };
    console.log(filterArray);
    console.log(filter);
    const userFound = await User.find(filter, "cuisines").exec();
    console.log(userFound);
    if (userFound) {
      for (var i = 0; i < userFound.length; i++) {
        const userID = userFound[i]._id;
        const restaurantFilter = { owner: userID };
        const restaurantObject = await Restaurant.findOne(
          restaurantFilter
        ).exec();
        const userObject = JSON.parse(JSON.stringify(userFound[i]));
        userObject.name = restaurantObject.name;
        userObject.owner = restaurantObject.owner;
        userObject.menu = restaurantObject.menu;
        userObject.address = restaurantObject.address;
        userObject.postcode = restaurantObject.postcode;
        userObject.reviewRating = restaurantObject.reviewRating;
        userObject.description = restaurantObject.description;
        userObject.restaurantPicture = restaurantObject.restaurantPicture;
        userObject._id = restaurantObject._id;
        restaurants.push(userObject);
      }
    }

    const result = await findAvailQuantities(restaurants);
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Could not filter");
  }
};

const browseByFilterByLocation = async (req, res) => {
  try {
    const restaurants = [];
    const filterArray = req.query.filter;
    console.log(filterArray);
    const filter = { postcode: { $all: filterArray } };
    console.log(filter);
    const restaurantFound = await Restaurant.find(filter).exec();
    console.log(restaurantFound);
    if (restaurantFound) {
      for (var i = 0; i < restaurantFound.length; i++) {
        const userID = restaurantFound[i].owner;
        const userFilter = { _id: userID, isDiner: false };
        const userObject = await User.findOne(userFilter).exec();
        console.log(userObject);
        const restaurantObject = JSON.parse(JSON.stringify(restaurantFound[i]));
        restaurantObject.cuisines = userObject.cuisines;
        restaurants.push(restaurantObject);
      }
    }

    const result = await findAvailQuantities(restaurants);
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Could not filter");
  }
};

const browseByFilterByTime = async (req, res) => {
  try {
    const fromDate = new Date(req.query.fromDate);
    const endDate = new Date(req.query.endDate);
    console.log(fromDate);

    const voucherInstances = await VoucherInstance.aggregate(
      [
        {
          '$match': {
            '$or': [
              {
                '$and': [{ 'startDateTime': { $gte: fromDate } }, { 'startDateTime': { $lte: endDate } }]
              },
              {
                '$and': [{ 'endDateTime': { $gte: fromDate } }, { 'endDateTime': { $lte: endDate } }]
              }
            ]
          }
        },
        {
          '$lookup': {
            'from': Voucher.collection.name,
            'localField': 'voucher',
            'foreignField': '_id',
            'as': 'voucher'
          }
        },
        { '$unwind': '$voucher' },
        {
          '$lookup': {
            'from': Restaurant.collection.name,
            'localField': 'voucher.createdBy',
            'foreignField': 'owner',
            'as': 'restaurant'
          }
        },
        { '$unwind': '$restaurant' },
        {
          '$project': {
            _id: 1,
            'voucher.title': 1,
            'voucher.description': 1,
            'voucher.discount': 1,
            availableQuantity: 1,
            startDateTime: 1,
            endDateTime: 1,
            restaurant: 1,
          }
        },
      ]);

    console.log('voucherInstances', voucherInstances.length);
    const mapRestaurants = new Map();

    voucherInstances.map((voucherInstance) => {
      const restaurantId = voucherInstance.restaurant._id.toString();
      console.log(voucherInstance._id);
      if (mapRestaurants.has(restaurantId)) {
        const restaurant = mapRestaurants.get(restaurantId);
        restaurant.availableQuantity = restaurant.availableQuantity + voucherInstance.availableQuantity;
        restaurant.voucherInstanceIds.push(voucherInstance._id);
      } else {
        const restaurant = voucherInstance.restaurant;
        restaurant.availableQuantity = voucherInstance.availableQuantity;
        restaurant.voucherInstanceIds = [voucherInstance._id];
        mapRestaurants.set(restaurantId, restaurant);
      }
    })


    const responseObject = [];
    mapRestaurants.forEach((each) => {
      each.reviewRating = parseFloat(each.reviewRating.toFixed(2));
      responseObject.push(each);
    })
    return res.json(responseObject.sort((a, b) => parseFloat(b.availableQuantity) - parseFloat(a.availableQuantity)));

  } catch (err) {
    console.log('FAILED TO BROWSING BY TIME', err);
    return res.status(400).send('Could not filter')
  }

}

module.exports = {
  browseRestaurantByName,
  browseRestaurantKeyWord,
  browseByFilterByCuisine,
  browseByFilterByLocation,
  browseByFilterByTime,
  findAvailQuantities,
};
