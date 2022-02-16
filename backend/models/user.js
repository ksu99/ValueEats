import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      // First name of user (could be diner or eatery)
      type: String,
      trim: true,
      required: 'First name is required',
    },
    lastName: {
      // Last name of user (could be diner or eatery)
      type: String,
      trim: true,
      required: 'Last name is required',
    },
    email: {
      // Email user used to sign up
      type: String,
      trim: true,
      required: 'Email is required',
      unique: true,
    },
    password: {
      // Password of user
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    address: {
      // Address of user, if diner, is their residential address
      type: String, // if eatery, is their restaurant location
      required: 'Address is required',
    },
    postcode: {
      // Postcode, similar to address
      type: String,
      required: 'Postcode is required',
    },
    isDiner: {
      // Boolean which checks if they are a diner or eatery
      type: Boolean,
      required: 'Type of user is required',
    },
    cuisines: {
      // if isDiner is true, cuisines represents their preferences
      type: Array, // if isDiner is false, cuisines represents what they offer
      default: [],
    },
    profilePicture: {
      type: String,
      default: 'https://bit.ly/3kxHzDL',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log('BCRYPT HASH ERR', err);
        return next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log('password does not match');
      return next(err, false);
    }

    console.log('match password', match);
    return next(null, match);
  });
};
// we export as mongon model
export default mongoose.model('User', userSchema);
