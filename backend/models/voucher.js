import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const voucherSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      required: 'Discount is required',
    },
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      type: Array,
      /*
    if a voucher event repeats everyday 
      recurrence: ['RRULE:FREQ=DAILY']
    if a voucher event repeats with a specify number of instances 
      recurrence: ['RRULE:FREQ=DAILY;COUNT=10']
    We can choose one or more days of the week to repeat on, and even alternate between specific days
      recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=TH'] # every Thursday
      recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR'] # every Mon, Wed and Fri
      recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=TU;INTERVAL=2'] # every other Tuesday
    A voucher event starting on June 1st, 2015 and repeating every 3 days excluding June 10th but including June 9th and 11th with startDateTime 2015-06-01, 1pm to endDateTime  2015-06-01, 2pm and number of occurences = 10
    startDateTime: new Date("2015-06-01T13:00:00.000")
    endDateTime: new Date("2015-06-01T14:00:00.000")
    recurrence: [
      'EXDATE;VALUE=DATE:20150610',   // this will exclude the date appear on the pattern
      'RDATE;VALUE=DATE:20150609,20150611', // include some extra dates that do not appear on the pattern. 
      'RRULE:FREQ=DAILY;COUNT=10;INTERVAL=3'
    ],

    Refer to the google calendar api for more detail about recurring event
    https://developers.google.com/calendar/api/concepts/events-calendars
    */
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
      required: 'Creator is required',
    },
    quantity: {
      type: Number,
      required: 'Quantity is required',
    },
    releaseDateTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

// we export as mongon model
export default mongoose.model('Voucher', voucherSchema);
