import User from "../models/user";
import Review from "../models/review";
import Restaurant from "../models/restaurant";
import Voucher from "../models/voucher";
import VoucherCode from "../models/voucherCode";
import VoucherInstance from "../models/voucherInstance";
import LikedReview from "../models/likedReview";

const findReviews = async (userId) => {
  const reviews = await Review.find({
    $or: [{ diner: userId }, { eatery: userId }],
  }).lean();
  return reviews;
};

const findUserInfo = async (userId, res) => {
  const userInfo = await User.findOne({ _id: userId })
    .exec()
    .catch((_) => res.status(400).send("Invalid userId"));
  return userInfo;
};

const findRestaurantInfo = async (restaurantId, res) => {
  const restaurantInfo = await Restaurant.findOne({ _id: restaurantId })
    .exec()
    .catch((_) => res.status(400).send("Invalid restaurantId"));
  return restaurantInfo;
};

const userReview = async (req, res) => {
  try {
    console.log(req.query.userId);
    const userId = req.query.userId;
    const reviews = await findReviews(userId);
    console.log("profile review ", reviews);

    if (reviews.length === 0) return res.json({ reviews: [] });

    const user = await findUserInfo(userId, res);
    const likedReviews = await LikedReview.find({ reviewer: userId }).exec();

    const setLikedReviews = new Set();
    likedReviews.map(likedReview => setLikedReviews.add(likedReview.review.toString()));
    console.log('setLikedReviews ', setLikedReviews);

    if (user.isDiner) {
      await Promise.all(
        reviews.map(async (review) => {
          const eatery = await findUserInfo(review.eatery, res);
          const restaurant = await findRestaurantInfo(review.restaurant, res);
          review.diner = constructSmallerUserObject(user);
          review.eatery = constructSmallerUserObject(eatery);
          review.restaurant = restaurant;
          review.isLiked = setLikedReviews.has(review._id.toString());
        })
      );
    } else {
      const restaurant = await findRestaurantInfo(reviews[0].restaurant, res);
      await Promise.all(
        reviews.map(async (review) => {
          review.eatery = constructSmallerUserObject(user);
          review.restaurant = restaurant;
          const diner = await findUserInfo(review.diner, res);
          review.diner = constructSmallerUserObject(diner);
          review.isLiked = setLikedReviews.has(review._id.toString());
        })
      );
    }

    const responseObject = { reviews };

    return res.json(responseObject);
  } catch (err) {
    console.log("FAILED TO GET USER REVIEW", err);
    return res.status(400).send("Failed to get reviews from this user");
  }
};

const eateryReview = async (req, res) => {
  // Retrieve the email field from request
  const email = req.query.email;

  console.log("Email of eatery is " + email);

  // Search the email inside database by creating a filter
  // Selection of rating and review from the database
  const eatery = await User.findOne({ email });

  await Review.find({ eatery: eatery._id }, async function(err, reviews) {
    if (err) {
      console.log(err);
      return res.status(400).send("Unsuccessful");
    } else {
      if (reviews.length == 0) {
        return res.status(400).send("Unable to find eatery");
      }
      console.log("BACKEND: ", reviews);
      reviews.map(async (review) => {
        const user = await User.findOne({ _id: review.diner }).exec();
        console.log("user is " + user);
        const nameDiner = user.firstName + " " + user.lastName;
        review["nameDiner"] = nameDiner;
      });
      return res.json(reviews);
    }
  });
};

// Update profile route for eateries
const profileUpdate = async (req, res) => {
  // Completed for handover to Calvin
  console.log(req.body);

  // Request will include the user sending request, which includes their email
  // and isDiner status.
  // Check this status to determine if name and address are related to diner
  // or eatery.
  // Then, update the corresponding field in user.

  try {
    const { user } = req.body;
    const email = user.email;
    var isDiner = user.isDiner;
    const name = user.name;
    const address = user.address;
    const postcode = user.postcode;
    const cuisines = user.cuisines;
    const profilePicture = user.profilePicture;

    //const {email, isDiner, name, address, postcode, cuisines} = req.body;
    const filter = { email };

    const names = name.split(" ");
    if (names.length != 2) {
      return res
        .status(400)
        .send("Names are invalid, please enter a first and last name");
    }
    const firstName = names[0];
    const lastName = names[1];

    // Check if an address is entered, regardless of diner or eatery
    if (!address) {
      return res.status(400).send("An address is required");
    }

    if (String(isDiner).toLowerCase() == "true") {
      console.log("is a Diner");

      // Check if a name is entered
      if (!name) {
        return res.status(400).send("A name is required");
      }

      const update = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        postcode: postcode,
        cuisines: cuisines,
      };

      if (profilePicture) {
        update.profilePicture = profilePicture;
      }

      // Search if diner is in database
      const DinerFind = await User.findOne(filter).exec();

      if (DinerFind) {
        await User.findOneAndUpdate(filter, update, { new: true });
        console.log("Diner profile updated");
        return res.status(200).send("Successfully updated diner details");
      } else {
        return res.status(400).send("Could not find user");
      }
    } else {
      const menu = user.menu;
      const restaurantName = user.restaurantName;
      const restaurantAddress = user.restaurantAddress;
      const restaurantPostcode = user.restaurantPostcode;
      const restaurantPicture = user.restaurantPicture;
      const description = user.description;

      // Check if a restaurant name is entered
      if (!name) {
        return res.status(400).send("A restaurant name is required");
      }

      // Update cuisines in User schema
      const updateUser = {
        cuisines: cuisines,
        address: address,
        postcode: postcode,
        firstName: firstName,
        lastName: lastName,
      };

      if (profilePicture) {
        updateUser.profilePicture = profilePicture;
      }

      const userFind = await User.findOneAndUpdate(filter, updateUser, {
        new: true,
      });

      console.log(userFind._id);

      if (userFind) {
        console.log("Cuisines offered updated");
      } else {
        return res.status(400).send("Could not find restaurant");
      }

      const restFilter = { owner: userFind._id };

      // Update menu
      if (menu) {
        const updateMenu = { menu: menu };
        const menuResponse = await Restaurant.findOneAndUpdate(
          restFilter,
          updateMenu,
          { new: true }
        );

        console.log("Restaurant Find");

        if (menuResponse) {
          console.log("Menu has been updated");
        } else {
          return res.status(400).send("Menu could not be updated");
        }
      }

      // Update profile picture
      if (restaurantPicture) {
        const updatePicture = { restaurantPicture: restaurantPicture };
        const pictureResponse = await Restaurant.findOneAndUpdate(
          restFilter,
          updatePicture,
          { new: true }
        );

        console.log("Restaurant Find");

        if (pictureResponse) {
          console.log("Restaurant picture has been updated");
        } else {
          return res
            .status(400)
            .send("Restaurant picture could not be updated");
        }
      }

      // Update restaurantName and address in Restaurant schema
      const updateRestaurant = {
        name: restaurantName,
        address: restaurantAddress,
        postcode: restaurantPostcode,
        description: description,
      };
      const restFind = await Restaurant.findOneAndUpdate(
        restFilter,
        updateRestaurant,
        { new: true }
      );

      if (restFind) {
        console.log("Details updated");
      } else {
        return res.status(400).send("Could not find restaurant");
      }

      return res.status(200).send("Successfully updated restaurant details");
    }
  } catch (err) {
    console.log("Could not update profile");
    return res.status(400).send("Error. Please try again");
  }
};

const makeVoucherSchemas = async (req, res) => {
  const voucherCode = new VoucherCode({
    voucherInstance: "60db074ba797e410f89e9ed9",
    diner: "60db074ba797e410f89e9ed9",
    eatery: "60db074ba797e410f89e9ed9",
  });
  await voucherCode.save();

  const voucherInstance = new VoucherInstance({
    voucher: "60db074ba797e410f89e9ed9",
    createdyBy: "60db074ba797e410f89e9ed9",
    availableQuantity: "10",
  });
  await voucherInstance.save();

  return res.status(200).send("Success");
};

// User Story 2.3
// An eatery should be able to view all booked vouchers for that eatery
// Each voucher is an instance of VoucherCode that belongs to one diner, so that
// a discount can be applied by scanning the voucher code.
// Returns VoucherCode which contains:
//        Diner object
//        Eatery object
//        Redeemed status
//        Voucher id
// Also returns VoucherInstance which contains:
//        Start time
//        End time
//        Voucher id
const getVouchers = async (req, res) => {
  try {
    //const email = req.query.email;
    var userId = req.query.userId;

    //console.log('Email of searcher is' + email);
    console.log("id of searcher is " + userId);

    const filter = { _id: userId };
    const vouchers = {};

    await User.find(filter, async function(err, docs) {
      if (err) {
        console.log(err);
        return res.status(400).send("Could not find user with that id");
      } else {
        console.log(docs);
        const user = docs[0];
        console.log(user);
        var userId = user._id;
        const isDiner = user.isDiner;
        var VoucherCodeFilter = {};
        if (isDiner) {
          VoucherCodeFilter = { diner: userId };
        } else {
          //const eateryId = await Restaurant.findOne({ owner: userId }).exec();
          VoucherCodeFilter = { eatery: userId };
          console.log(VoucherCodeFilter);
        }
        // Get individual voucher codes, which represent codes that have been booked
        vouchers["codes"] = await fetchVoucherCodes(user, VoucherCodeFilter);
        //console.log(vouchers['codes']);

        // Sort voucher codes by startDateTime where the latest (newest) code appears
        // first
        vouchers["codes"].sort(function(a, b) {
          var dateA = new Date(a.startDateTime),
            dateB = new Date(b.startDateTime);
          return dateB - dateA;
        });

        if (!isDiner) {
          // Eateries will also need to display voucher instances, so they can
          // change any detail about the instances before they're released.
          vouchers["instances"] = await fetchVoucherInstances(user);
          vouchers["instances"].sort(function(a, b) {
            var dateA = new Date(a.startDateTime),
              dateB = new Date(b.startDateTime);
            return dateB - dateA;
          });
        }

        return res.json(vouchers);
      }
    });
  } catch (err) {
    console.log("Could not find any vouchers");
    return res.status(400).send("Could not find any vouchers");
  }
};

const fetchVoucherCodes = async function(user, filter) {
  var vouchers = [];
  const isDiner = user.isDiner;
  //console.log(filter);
  const VoucherCodes = await VoucherCode.find(filter).exec();
  //console.log(VoucherCodes);
  for (var i = 0; i < VoucherCodes.length; i++) {
    const voucherInstanceId = VoucherCodes[i].voucherInstance;
    const voucherInstance = await VoucherInstance.findOne({
      _id: voucherInstanceId,
    }).exec();
    console.log("voucherCode ", VoucherCodes[i]);
    vouchers.push(
      await makeVoucherObject(user, VoucherCodes[i], voucherInstance, isDiner)
    );
  }

  return vouchers;
};

const fetchVoucherInstances = async function(user) {
  const filter = { createdBy: user };
  const vouchers = await Voucher.find(filter).exec();
  let voucherInstances = [];
  await Promise.all(
    vouchers.map(async (voucher) => {
      const voucherInstancesFromVoucher = await VoucherInstance.find({
        voucher: voucher._id,
      }).exec();
      voucherInstances.push(voucherInstancesFromVoucher);
    })
  );
  return voucherInstances;
};

const makeVoucherObject = async function(
  user,
  voucherCode,
  voucherInstance,
  isDiner
) {
  const voucherObject = {};
  //console.log(voucherCode);
  if (isDiner) {
    voucherObject["diner"] = user._id;
    voucherObject["dinerName"] = user.firstName + " " + user.lastName;
    voucherObject["eatery"] = voucherCode.eatery;
    const eatery = await Restaurant.findOne({
      owner: voucherCode.eatery,
    }).exec();
    voucherObject["eateryName"] = eatery.name;
    voucherObject["restaurantId"] = eatery._id;
  } else {
    voucherObject["diner"] = voucherCode.diner;
    const diner = await User.findOne({ _id: voucherCode.diner }).exec();
    voucherObject["dinerName"] = diner.firstName + " " + diner.lastName;
    voucherObject["eatery"] = user._id;
    const eatery = await Restaurant.findOne({ owner: user._id }).exec();
    voucherObject["eateryName"] = eatery.name;
    voucherObject["restaurantId"] = eatery._id;
  }

  voucherObject["redeemed"] = voucherCode.isRedeem;
  voucherObject["voucherInstanceId"] = voucherCode.voucherInstance;
  voucherObject["voucherCodeId"] = voucherCode._id;
  voucherObject["startDateTime"] = new Date(voucherInstance.startDateTime);
  voucherObject["endDateTime"] = new Date(voucherInstance.endDateTime);

  const voucher = await Voucher.findOne({
    _id: voucherInstance.voucher,
  }).exec();
  console.log(voucherInstance);

  voucherObject["discount"] = voucher.discount;

  return voucherObject;
};

const constructSmallerUserObject = (user) => {
  return {
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    profilePicture: user.profilePicture,
  }
}


module.exports = {
  profileUpdate,
  eateryReview,
  getVouchers,
  userReview,
};
