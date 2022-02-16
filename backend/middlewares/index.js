import expressJwt from 'express-jwt';
import blacklist from 'express-jwt-blacklist';
import User from '../models/user';
import Voucher from '../models/voucher';
import VoucherInstance from '../models/voucherInstance';
import { rrulestr } from 'rrule';
import dateFormat from 'dateformat';

const getOccurences = (dateTime, recurrence) => {
  const dtRFCFormat = dateFormat(dateTime, "yyyymmdd'T'HHMMss");
  const dtStart = `DTSTART:${dtRFCFormat}`;
  let rruleSetString = `${dtStart}\n`;
  recurrence.map((rule, index) => {
    rruleSetString =
      index !== recurrence.length - 1
        ? rruleSetString + rule + '\n'
        : rruleSetString + rule;
  });
  return rrulestr(rruleSetString, { forceset: true });
};

const voucherInstanceGenerator = async (voucher) => {
  const voucherInstances = await VoucherInstance.find({
    voucher: voucher._id,
  }).exec();

  const voucherReleaseDateTime = voucher.releaseDateTime;
  const currentDateTime = new Date();

  // if current time pass the release date time of thhe voucher and have no instances created yet, then create all instances
  if (
    voucherReleaseDateTime <= currentDateTime &&
    voucherInstances.length === 0
  ) {
    const voucherInstanceFields = {
      voucher: voucher._id,
      availableQuantity: voucher.quantity,
    };

    const firstStartDateTime = voucher.startDateTime;

    const firstEndDateTime = voucher.endDateTime;

    if (!voucher.isRecurring) {
      const voucherInstance = new VoucherInstance({
        ...voucherInstanceFields,
        startDateTime: firstStartDateTime,
        endDateTime: firstEndDateTime,
      });
      await voucherInstance.save();
    } else {
      // Todo for US2.2
      // Find occurences by recurence rules
      let recurrence = voucher.recurrence;
      const startOccurences = getOccurences(
        firstStartDateTime,
        recurrence
      ).all();

      const dayMap = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' }

      const firstEndDay = dayMap[firstEndDateTime.getDay()];
      const firstStartDay = dayMap[firstStartDateTime.getDay()];

      if (firstEndDay !== firstStartDay) {
        console.log('different dates');
        const firstEndDay = dayMap[firstEndDateTime.getDay()];

        const indexByDay = recurrence[0].indexOf('BYDAY');

        recurrence[0] = recurrence[0].substring(0, indexByDay + 6) + firstEndDay;
        console.log('firstend date time', firstEndDateTime);
        console.log('recurrence for end date ', recurrence)
      }

      const endOccurences = getOccurences(firstEndDateTime, recurrence).all();


      const occurences = startOccurences.map((startOccurence, index) => {
        const endOccurence = endOccurences[index];

        return [
          new Date(startOccurence.toJSON().slice(0, -1)),
          new Date(endOccurence.toJSON().slice(0, -1)),
        ];
      });
      console.log(occurences);
      occurences.map((occurence) => {
        const voucherInstance = new VoucherInstance({
          ...voucherInstanceFields,
          startDateTime: occurence[0],
          endDateTime: occurence[1],
        });

        voucherInstance.save();
      });
    }
  }
};

blacklist.configure({
  tokenId: '_id',
});

export const requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  isRevoked: blacklist.isRevoked
});

export const generateVoucherInstance = async (req, res, next) => {
  console.log('get query', req.query.eateryId);
  const eatery = await User.findById(req.query.eateryId).exec();

  if (!eatery) {
    res.status(400).send('Can not find the eatery');
  }

  const eateryId = eatery._id;

  const vouchers = await Voucher.find({ createdBy: eateryId }).exec();

  console.log(vouchers);

  vouchers.map((voucher) => voucherInstanceGenerator(voucher));
  next();
};

export { blacklist }
