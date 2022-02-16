import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const voucherCodeSchema = new Schema(
  {
    voucherInstance: {
      type: ObjectId,
      ref: 'VoucherInstance',
      required: 'Voucher Instance reference is required',
    },
    diner: {
      type: ObjectId,
      ref: 'User',
      required: 'Diner reference is required',
    },
    eatery: {
      type: ObjectId,
      ref: 'User',
      required: 'Eatery reference is required',
    },
    isRedeem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// we export as mongon model
export default mongoose.model('VoucherCode', voucherCodeSchema);
