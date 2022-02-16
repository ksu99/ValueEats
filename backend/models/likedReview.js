import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const likedReview = new Schema(
  {
    reviewer: {
      type: ObjectId,
      ref: 'User',
      required: 'A reviewer is required',
    },
    review: {
      type: ObjectId,
      ref: 'Review',
      required: 'A review is required',
    }
  },
  { timestamps: true }
)

export default mongoose.model('LikedReview', likedReview);
