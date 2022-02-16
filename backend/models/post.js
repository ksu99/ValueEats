import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const postSchema = new Schema(
  {
    creator: {
      type: ObjectId,
      ref: 'User',
      required: 'A creator is required',
    },
    eatery: {
      type: ObjectId,
      ref: 'Restaurant',
      required: 'A restaurant is required',
    },
    content: {
      type: String,
      required: 'A post is required',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
