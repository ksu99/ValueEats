import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const voucherInstanceSchema = new Schema(
  {
    voucher: {
      type: ObjectId,
      ref: 'Voucher',
      required: 'Voucher reference is required',
    },
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
    availableQuantity: {
      type: Number,
      required: 'Quantity is required',
    },
  },
  { timestamps: true }
);

// we export as mongon model
export default mongoose.model('VoucherInstance', voucherInstanceSchema);
