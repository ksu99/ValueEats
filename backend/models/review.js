import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const reviewSchema = new Schema(
  {
    diner: {
      type: ObjectId,
      ref: 'User',
      required: 'A diner is required',
    },
    eatery: {
      type: ObjectId,
      ref: 'User',
      required: 'A eatery is required',
    },
    restaurant: {
      type: ObjectId,
      ref: 'Restaurant',
      required: 'A restaurant is required',
    },
    rating: {
      // Rating (out of 5) the diner has left for the eater
      type: Number,
      min: 0,
      max: 5,
      required: 'A rating is required',
    },
    review: {
      // String of review comment
      type: String,
      trim: true,
      required: 'A review is required',
    },
    likes: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true } // Each instance of the schema has a date field
);

export default mongoose.model('Review', reviewSchema);
