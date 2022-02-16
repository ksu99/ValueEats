import User from '../models/user';
import Restaurant from '../models/restaurant';
import Follow from '../models/follow';

// A diner can follow an eatery to be updated on their feed
// PUT request with route localhost:8000/api/feed/follow
// The front-end will send the userId of the diner and of the owner
// The back-end will return confirmation of the follow
const follow = async (req, res) => {
  try {
    //console.log(req.body);
    const dinerId = req.body.dinerId;
    const ownerId = req.body.ownerId;

    const diner = await User.findOne({ _id: dinerId }).exec();
    //console.log(diner);
    if (String(diner.isDiner).toLowerCase() === 'false') {
      return res.status(400).send('Error. Only diners can follow');
    }
    const restaurant = await User.findOne({ _id: ownerId }).exec();
    console.log(restaurant);
    if (String(restaurant.isDiner).toLowerCase() === 'true') {
      return res.status(400).send('Error. You must follow a restaurant');
    }

    const follow = await Follow.findOne({
      owner: ownerId,
      followers: dinerId,
    }).exec();
    if (follow) {
      return res.status(400).send('Already following');
    }

    const filter = { owner: ownerId };
    const update = { $push: { followers: dinerId } };
    const newFollow = await Follow.findOneAndUpdate(filter, update, {
      new: true,
    }).exec();
    console.log(newFollow);
    return res.json(newFollow);
  } catch (err) {
    console.log('Error in code execution');
    return res.status(400).send('Error in code execution');
  }
};

// A diner can unfollow an eatery
// PUT request with route localhost:8000/api/feed/unfollow
// The front-end will send the userId of the diner and of the owner
// The back-end will return confirmation of the unfollow
const unfollow = async (req, res) => {
  try {
    console.log(req.body);
    const dinerId = req.body.dinerId;
    const ownerId = req.body.ownerId;

    const diner = await User.findOne({ _id: dinerId }).exec();
    if (String(diner.isDiner).toLowerCase() === 'false') {
      return res.status(400).send('Error. Only diners can follow');
    }
    const restaurant = await User.findOne({ _id: ownerId }).exec();
    if (String(restaurant.isDiner).toLowerCase() === 'true') {
      return res.status(400).send('Error. You must follow a restaurant');
    }

    const unfollow = await Follow.findOne({
      owner: ownerId,
      followers: dinerId,
    }).exec();
    if (!unfollow) {
      return res.status(400).send('You are not following this restaurant');
    }

    const filter = { owner: ownerId };
    const update = { $pull: { followers: dinerId } };
    const newUnfollow = await Follow.findOneAndUpdate(filter, update, {
      new: true,
    }).exec();
    return res.json(newUnfollow);
  } catch (err) {
    console.log('Error in code execution');
    return res.status(400).send('Error in code execution');
  }
};

// A user (diner or restaurant) can retrieve a list of their followers (if restaurant)
// or a list of restaurants they are following (if diner)
// GET request with route localhost:8000/api/feed/getFollow
// The front-end will send the userId of the user
// The back-end will return an array of their corresponding follow/followers
const getFollow = async (req, res) => {
  try {
    console.log(req.query);
    const userId = req.query.userId;

    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return res.status(400).send('Could not find user');
    }

    if (String(user.isDiner).toLowerCase() === 'false') {
      const followers = await Follow.findOne({ owner: userId }).exec();
      if (!followers) {
        return res.status(400).send('Could not find followers');
      } else {
        const dinerFollowers = [];
        for (var i = 0; i < followers.followers.length; i++) {
          const diner = followers.followers[i];
          const dinerObject = await User.findOne({ _id: diner }).exec();
          dinerFollowers.push(dinerObject);
        }
        return res.json({
          owner: followers.owner,
          eatery: followers.eatery,
          followersArray: dinerFollowers,
        });
      }
    } else {
      const following = await Follow.find({ followers: userId }).exec();
      console.log(following);
      const restaurantFollowing = [];
      for (var i = 0; i < following.length; i++) {
        const followingObject = {};
        const owner = await User.findOne({ _id: following[i].owner }).exec();
        const restaurant = await Restaurant.findOne({
          owner: following[i].owner,
        }).exec();
        console.log(owner);
        followingObject.owner = owner;
        followingObject.eatery = restaurant;
        restaurantFollowing.push(followingObject);
      }
      return res.json(restaurantFollowing);
    }
  } catch (err) {
    console.log('Error in code execution');
    return res.status(400).send('Error in code execution');
  }
};

module.exports = {
  follow,
  unfollow,
  getFollow,
};
