import User from '../../models/user';
import Voucher from '../../models/voucher';
import VoucherInstance from '../../models/voucherInstance';
import VoucherCode from '../../models/voucherCode';
import voucherInstance from '../../models/voucherInstance';

// POST method with route /voucher/code/create
// Front-end sends:
// The userID of the user making the booking
// The eateryID of the eatery the booking is for
// The voucherInstanceID of the voucherInstance the booking is for

// Back-end returns:
// Voucher code object if it was successful
const createVoucherCode = async (req, res) => {
  try {
    console.log('request body', req.body);
    const voucherInstance = req.body.voucherInstanceID;
    const dinerID = req.body.dinerID;
    const eateryID = req.body.eateryID;
    const isRedeem = false;

    // Check dinerID is a diner
    const dinerFilter = { _id: dinerID };
    const userFound = await User.findOne(dinerFilter).exec();
    if (String(userFound.isDiner).toLowerCase() == 'false') {
      return res.status(400).send('User trying to book is not a diner');
    }
    console.log('1');

    // Check if diner already has a voucher
    const voucherInstanceCodeFilter = { voucherInstance: voucherInstance };
    console.log(voucherInstanceCodeFilter);
    const voucherBooked = await VoucherCode.find(
      voucherInstanceCodeFilter
    ).exec();
    if (voucherBooked) {
      for (var i = 0; i < voucherBooked.length; i++) {
        if (voucherBooked[i].diner == dinerID) {
          return res.status(400).send('User has already booked this voucher');
        }
      }
    }

    // Checking constraints while creating voucher code
    const voucherInstanceFilter = { _id: voucherInstance };
    const VoucherInstanceFound = await VoucherInstance.findOne(
      voucherInstanceFilter
    ).exec();

    if (VoucherInstanceFound) {
      const voucherID = VoucherInstanceFound.voucher;
      const voucherFilter = { _id: voucherID };
      const voucherFound = await Voucher.findOne(voucherFilter).exec();
      const releaseDateTime = voucherFound.releaseDateTime;
      const currentDateTime = new Date();
      const endDateTime = VoucherInstanceFound.endDateTime;
      const quantity = VoucherInstanceFound.availableQuantity;
      console.log(VoucherInstanceFound);
      console.log(quantity, currentDateTime, releaseDateTime, endDateTime);
      if (
        // Available quantity in VoucherInstance > 0 to create a voucher code and current time must be after release time and before end time
        quantity > 0 &&
        currentDateTime > releaseDateTime &&
        currentDateTime < endDateTime
      ) {
        const update = { availableQuantity: quantity - 1 };
        await VoucherInstance.findOneAndUpdate(voucherInstanceFilter, update, {
          new: true,
        });
        const voucherCodeSchema = {
          voucherInstance: VoucherInstanceFound._id,
          diner: dinerID,
          eatery: eateryID,
          isRedeem: isRedeem,
        };

        const voucherCode = new VoucherCode(voucherCodeSchema);
        await voucherCode.save();

        return res.json({ voucherCode });
      } else {
        return res
          .status(400)
          .send(
            'This voucher is not available to be reserved due to time limitations'
          );
      }
    } else {
      return res.status(400).send('Could not find voucher instance');
    }
  } catch (err) {
    console.log('Could not create voucher code');
    return res.status(400).send('Failed to create voucher code');
  }
};

// DELETE method with route /voucher/code/delete
// Front-end sends:
// voucherCodeId of voucherCode being deleted
// userId of diner attempting to delete voucher code

// Back-end returns:
// 200 response if successful otherwise
// 400 response
const deleteVoucherCode = async (req, res) => {
  try {
    const voucherCodeID = req.query.voucherCodeId;
    const userID = req.query.userId;
    if (!voucherCodeID) {
      return res.status(400).send('Voucher code was not provided');
    }

    const voucherCodeFilter = { _id: voucherCodeID };
    const voucherCode = await VoucherCode.findOne(voucherCodeFilter).exec();
    const voucherInstanceID = voucherCode.voucherInstance;
    const dinerID = voucherCode.diner;
    const voucherInstanceFilter = { _id: voucherInstanceID };
    const voucherInstance = await VoucherInstance.findOne(
      voucherInstanceFilter
    ).exec();
    const endDateTime = voucherInstance.endDateTime;
    const currentDateTime = new Date();

    if (dinerID != userID) {
      return res.status(400).send('User is unauthorised to make this action');
    }

    if (currentDateTime > endDateTime) {
      return res
        .status(400)
        .send('Cannot delete a voucher that has already expired');
    }

    const voucherCodeDelete = await VoucherCode.deleteOne(
      voucherCodeFilter
    ).exec();
    if (voucherCodeDelete) {
      const quantity = voucherInstance.availableQuantity;
      const update = { availableQuantity: quantity + 1 };
      await VoucherInstance.findOneAndUpdate(
        voucherInstanceFilter,
        update
      ).exec();
      return res.status(200).send('Successfully deleted voucher');
    } else {
      console.log('Failed to delete voucher code');
      return res.status(400).send('Failed to delete voucher code');
    }
  } catch (err) {
    console.log('Could not delete voucher code');
    return res.status(400).send('Failed to delete voucher code');
  }
};

// GET method with route /voucher/display
// Front-end sends:
// userId of eatery the booking instances are for

// Back-end returns:
// Sorted array (by startDateTime) of all voucher instances
const displayVoucherInstance = async (req, res) => {
  try {
    var voucherInstances = [];
    var unreleasedVouchers = [];
    const eateryID = req.query.eateryId;
    const voucherFilter = { createdBy: eateryID };
    const vouchers = await Voucher.find(voucherFilter).exec();
    if (vouchers) {
      console.log('================NEW LOOP==============');
      for (var i = 0; i < vouchers.length; i++) {
        console.log(vouchers[i]);
        const voucherID = vouchers[i]._id;
        //console.log("ID: ", voucherID);
        const voucherInstancesArr = await VoucherInstance.find({
          voucher: voucherID,
        }).exec();
        if (voucherInstancesArr.length !== 0) {
          voucherInstancesArr.map((voucherInstance) => {
            //console.log("Instance: ", voucherInstance);
            const voucherInstanceObject = JSON.parse(
              JSON.stringify(voucherInstance)
            );
            voucherInstanceObject.discount = vouchers[i].discount;
            voucherInstanceObject.releaseDateTime = vouchers[i].releaseDateTime;
            voucherInstanceObject.isReleased =
              vouchers[i].releaseDateTime < new Date() ? true : false;
            voucherInstanceObject.description = vouchers[i].description;
            voucherInstances.push(voucherInstanceObject);
            console.log('OBJECT: ', voucherInstanceObject);
          });
        } else {
          unreleasedVouchers.push(vouchers[i]);
        }
      }

      voucherInstances.sort(function(a, b) {
        var dateA = new Date(a.startDateTime),
          dateB = new Date(b.startDateTime);
        return dateA - dateB;
      });

      return res.json({
        released: voucherInstances,
        unreleased: unreleasedVouchers,
      });
    }
  } catch (err) {
    console.log('Could not find any voucher instances', err);
    return res.status(400).send('Could not find any voucher instances');
  }
};

// TODO: REDEEM A VOUCHER CODE
// PUT method with route /voucher/code/redeem
// Front-end sends:
// userId of diner the voucher code belongs to
// voucherCodeId of the code itself
// userId of eatery making the redemption

// Back-end returns:
// Successful/Unsuccessful redemption

const redeemVoucherCode = async (req, res) => {
  try {
    // Get userId and voucherCodeId

    console.log('request body', req.body);
    const dinerId = req.body.dinerID;
    const eateryId = req.body.eateryID;
    const voucherCodeId = req.body.voucherCodeID;

    const voucherCodeFilter = { _id: voucherCodeId };
    const voucherCodeFound = await VoucherCode.findOne(
      voucherCodeFilter
    ).exec();
    const voucherInstanceFilter = { _id: voucherCodeFound.voucherInstance };
    const voucherInstanceFound = await VoucherInstance.findOne(
      voucherInstanceFilter
    ).exec();

    // Checks:

    if (!voucherCodeFound) {
      console.log('Could not find voucher code');
      return res.status(400).send('Could not find voucher code');
    }

    // check if voucherCodeId belongs to userId
    if (voucherCodeFound.diner != dinerId) {
      console.log('Diner is not the same as voucher code');
      return res.status(400).send('Diner is not the same as voucher code');
    }

    // check if userId of eatery matches with voucherCode
    if (voucherCodeFound.eatery != eateryId) {
      console.log('Eatery is not the same as voucher code');
      return res.status(400).send('Eatery is not the same as voucher code');
    }

    // check if isRedeem is false
    if (String(voucherCodeFound.isRedeem).toLowerCase() == 'true') {
      console.log('Voucher code has already been redeemed');
      return res.status(400).send('Voucher code has already been redeemed');
    }

    // check if current time is between startDateTime and endDateTime
    const currentDateTime = new Date();
    const startDateTime = voucherInstanceFound.startDateTime;
    const endDateTime = voucherInstanceFound.endDateTime;
    if ((currentDateTime < startDateTime) | (currentDateTime > endDateTime)) {
      console.log('This voucher is not valid at this time');
      return res.status(400).send('Voucher code is not valid at this time');
    }

    // Set isRedeem to true
    const update = { isRedeem: true };

    const redeemedVoucherCode = await VoucherCode.findOneAndUpdate(
      voucherCodeFilter,
      update,
      {
        new: true,
      }
    ).exec();

    console.log(redeemedVoucherCode);

    console.log('Successfully redeemed voucher');
    return res.status(200).send('Successfully redeemed voucher');
  } catch (err) {
    console.log('Could not redeem voucher');
    console.log(err);
    return res.status(400).send('Could not redeem voucher');
  }
};

module.exports = {
  createVoucherCode,
  deleteVoucherCode,
  displayVoucherInstance,
  redeemVoucherCode,
};
