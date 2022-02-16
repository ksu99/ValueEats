import User from '../models/user';
import Restaurant from '../models/restaurant';
import Follow from '../models/follow';
import { blacklist } from '../middlewares';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    console.log('USER EXIST', user);
    if (!user) res.status(400).send('User is not exist yet');

    user.comparePassword(password, (err, match) => {
      console.log('COMPARE PASSWORD', err);
      if (!match || err) {
        return res.status(400).send('Wrong password');
      }
      console.log('MATCHED PASSWORD', match);
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const userResponse = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        postcode: user.postcode,
        isDiner: user.isDiner,
        cuisines: user.cuisines,
        profilePicture: user.profilePicture,
      };

      if (user.isDiner) {
        return res.json({
          token: token,
          user: userResponse,
        });
      }
      // user is an eatery and getting restaurant data
      Restaurant.findOne({ owner: user._id })
        .exec()
        .then((restaurant) => {
          userResponse.restaurantId = restaurant._id;
          userResponse.restaurantName = restaurant.name;
          userResponse.restaurantAddress = restaurant.address;
          userResponse.restaurantPostcode = restaurant.postcode;
          userResponse.restaurantPicture = restaurant.restaurantPicture;
          userResponse.restaurantDescription = restaurant.description;
          userResponse.menu = restaurant.menu;
          return res.json({
            token: token,
            user: userResponse,
          });
        });
    });
  } catch (err) {
    return res.status(400).send('Sign in failed');
  }
};

const register = async (req, res) => {
  // print data sent from the frontend
  console.log(req.body);
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      postcode,
      address,
      cuisines,
      isDiner,
    } = req.body;

    // validation
    if (!firstName && !lastName) {
      return res.status(400).send('name fields are required');
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required or must be min 6 characters long');
    }

    if (!postcode || !address) {
      return res.status(400).send('Postcode and address are required');
    }

    const userExit = await User.findOne({ email: email }).exec();
    if (userExit) return res.status(400).send('Email is taken');

    // register

    const user = new User({ ...req.body });

    if (isDiner) {
      await user.save();
      console.log('User created', user);
      return res.json({ ok: true, user: 'diner' });
    } else {
      const {
        restaurantName,
        restaurantAddress,
        restaurantPostcode,
        menu,
        restaurantPicture,
        restaurantDescription,
      } = req.body;

      //validate restaurant cuisines and name
      if (!cuisines || !restaurantName) {
        return res
          .status(400)
          .send(
            'A restaurant must have a name or at least on offered cuisines'
          );
      }

      if (!restaurantAddress) {
        return res.status(400).send('Please enter your restaurant address');
      }

      if (!menu) {
        return res.status(400).send('Please upload your menu');
      }

      if (!restaurantDescription) {
        return res.status(400).send('Please add your restaurant description');
      }

      if (!restaurantPicture) {
        return res.status(400).send('Please add your restaurant description');
      }

      const restaurant = new Restaurant({
        name: restaurantName,
        owner: user._id,
        address: restaurantAddress,
        postcode: restaurantPostcode,
        menu: menu,
        description: restaurantDescription,
        restaurantPicture: restaurantPicture,
      });

      await user.save();
      await restaurant.save();

      const follow = new Follow({
        owner: user._id,
        eatery: restaurant._id,
        followers: [],
      });

      await follow.save();

      console.log('User created', user);
      console.log('Restaurant is created', restaurant);

      return res.json({ ok: true, user: 'eatery' });
    }
  } catch (err) {
    console.log('CREATE USER FAILED', err);
    return res.status(400).send('Error. Try again.');
  }
};

const logout = (req, res) => {
  console.log('req._id ', req.user);
  blacklist.revoke(req.user);
  res.status(200).send('successfull logout');
};

module.exports = {
  login,
  register,
  logout,
};
