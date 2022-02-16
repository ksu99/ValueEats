import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const restaurantSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Restaurant name is required',
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: 'Owner is required',
  },
  menu: {
    type: String,
    required: 'A menu is required',
  },
  address: {
    type: String,
    required: 'An address is required',
  },
  postcode: {
    type: String,
    required: 'A postcode is required',
  },
  reviewRating: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: 'A description for your restaurant is required',
  },
  restaurantPicture: {
    type: String,
    required: 'A restaurant picture is required',
  },
});

export default mongoose.model('Restaurant', restaurantSchema);
