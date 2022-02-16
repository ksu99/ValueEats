import User from "../models/user";
import Restaurant from "../models/restaurant";
import Post from "../models/post";
import Follow from "../models/follow";

// A restaurant can write a post which will be displayed on followers' feed
// POST request with route localhost:8000/api/post/write
// The front-end will send the creator userId, string of content, and a link to any image
// included in the post
// The back-end will return the post structure if created
const writePost = async (req, res) => {
  try {
    const { userId, content, image } = req.body;
    console.log(userId, content, image);

    // Check if creator exists in database
    const user = await User.findOne({ _id: userId }).exec();
    if (!user || String(user.isDiner).toLowerCase() == "true") {
      return res.status(400).send("Restaurant does not exist");
    } else {
      if (content === "") {
        // Check if content is contained in request
        return res.status(400).send("Error. Post is empty");
      }

      const restaurant = await Restaurant.findOne({ owner: userId }).exec();
      const restaurantId = restaurant._id;

      const newPost = await new Post({
        creator: userId,
        eatery: restaurantId,
        content: content,
        image: image,
      }).save();

      return res.json({ post: newPost });
    }
  } catch (err) {
    console.log("Error, could not create a post");
    return res.status(400).send("Failed to create a post. Please try again");
  }
};

// A user (diner or restaurant) can access a restaurants page to view all their posts
// GET request with route localhost:8000/api/post/get
// The front-end will send the userId of the restaurant
// The back-end will return an array of post objects made by the restaurant
const getRestaurantPost = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Check if user exists
    const user = await User.findOne({ _id: userId }).exec();
    if (!user || String(user.isDiner).toLowerCase() === "true") {
      return res.status(400).send("User does not exist");
    }
    const restaurant = await Restaurant.findOne({ owner: userId }).exec();

    const restaurantPostFilter = { creator: userId };
    const restaurantPosts = await Post.find(restaurantPostFilter).exec();
    const restaurantPostObject = {};
    restaurantPostObject.user = {
      email: user.email,
      profilePicture: user.profilePicture,
      firstName: user.firstName,
      lastName: user.lastName,
      cuisines: user.cuisines,
      _id: user._id,
      postcode: user.postcode,
      address: user.address,
      isDiner: user.isDiner,
    };
    restaurantPostObject.restaurant = restaurant;
    restaurantPostObject.posts = JSON.parse(JSON.stringify(restaurantPosts));
    // even if posts are empty, return an empty array
    return res.json(restaurantPostObject);
  } catch (err) {
    console.log("Could not retrieve posts");
    return res.status(400).send("Failed to retrieve posts");
  }
};

// A diner can get all posts from restaurants they are following
// GET request with route localhost:8000/api/post/getPostFromFollower
// The front-end will send the dinerId of the diner
// The back-end will return an array of posts that the userId follows
const getPostFromFollowers = async (req, res) => {
  try {
    const dinerId = req.query.dinerId;

    const user = await User.findOne({ _id: dinerId }).exec();
    if (!user || String(user.isDiner).toLowerCase() === "false") {
      return res.status(400).send("Diner does not exist");
    }

    const following = await Follow.find({ followers: dinerId }).exec();
    console.log(following);
    const allFollowing = [];
    for (var i = 0; i < following.length; i++) {
      allFollowing.push(following[i].owner);
    }
    console.log(allFollowing);

    const posts = await Post.find({ creator: allFollowing }).exec();
    console.log(posts);
    const allPost = [];
    for (var i = 0; i < posts.length; i++) {
      const postObject = {};
      const userId = posts[i].creator;
      const restaurantId = posts[i].eatery;
      const user = await User.findOne({ _id: userId }).exec();
      const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
      postObject.user = {
        email: user.email,
        profilePicture: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName,
        cuisines: user.cuisines,
        _id: user._id,
        postcode: user.postcode,
        address: user.address,
        isDiner: user.isDiner,
      };

      postObject.restaurant = restaurant;
      postObject.post = posts[i];
      allPost.push(postObject);
    }

    return res.json(allPost);
  } catch (err) {
    console.log("Error in code execution");
    return res.status(400).send("Error in code execution");
  }
};

// An eatery can delete a post specified by a post id
// DELETE request with route localhost:8000/api/post/delete
// The front-end will send the userId of the restaurant and the id of the post deleted
// The back-end will send confirmation if the post is deleted
const deletePost = async (req, res) => {
  try {
    const postId = req.query.postId;
    const userId = req.query.userId;
    const postFilter = { _id: postId };
    console.log(postId, userId);
    const post = await Post.findOne(postFilter).exec();
    if (!post) {
      return res.status(400).send("Could not find post to delete");
    }

    const postCreator = post.creator;

    if (postCreator != userId) {
      return res
        .status(400)
        .send("Could not delete post, user is unauthorised");
    } else {
      const postDelete = await Post.deleteOne(postFilter).exec();
      if (postDelete) {
        return res.status(200).send("Post has been deleted");
      } else {
        console.log("Could not delete post");
        return res.status(400).send("Post could not be deleted");
      }
    }
  } catch (err) {
    console.log("Could not delete post, failed executing code");
    return res.status(400).send("Could not delete post, failed executing code");
  }
};

// An eatery can update the contents of a post specified by a post id
// PUT request with route localhost:8000/api/post/update
// The front-end will send the userId of the restaurant, the post id, and a string of details
// which may include a new image
// The back-end will send the updated post if successful
const updatePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;
    const contentString = req.body.content;
    const contentImage = req.body.image;
    console.log(req.body);

    const user = await User.findOne({ _id: userId }).exec();
    if (!user || String(user.isDiner).toLowerCase() === "true") {
      return res.status(400).send("User is unauthorised");
    }

    var update = {};
    update = { content: contentString, image: contentImage };

    console.log(update);
    const postFilter = { _id: postId, creator: userId };
    const post = await Post.findOne(postFilter).exec();
    if (!post) {
      return res.status(400).send("Could not find post to update");
    } else {
      const updatedPost = await Post.findOneAndUpdate(postFilter, update, {
        new: true,
      });
      return res.json(updatedPost);
    }
  } catch (err) {
    console.log("Could not update post, failed executing code");
    return res.status(400).send("Could not update post, failed executing code");
  }
};

module.exports = {
  writePost,
  getRestaurantPost,
  getPostFromFollowers,
  deletePost,
  updatePost,
};
