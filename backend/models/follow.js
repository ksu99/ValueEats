import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const followSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
      required: "An owner is required",
    },
    eatery: {
      type: ObjectId,
      ref: "Restaurant",
      required: "A restaurant is required",
    },
    followers: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Follow", followSchema);