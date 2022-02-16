import User from "../../models/user";
import Voucher from "../../models/voucher";

const validateEatery = async (eateryId, res) => {
  const eatery = await User.findOne({ _id: eateryId })
    .exec()
    .catch((_) => res.status(400).send("Invalid eatery id"));

  if (!eatery) {
    return res.status(400).send("Eatery is not exist");
  }

  if (eatery.isDiner) {
    return res
      .status(400)
      .send("User is not an eatery, please register an eatery account");
  }
};

const constructVoucher = async (req, res) => {
  console.log("request body", req.body);
  let {
    title,
    description,
    discount,
    startDateTime,
    endDateTime,
    quantity,
    isRecurring,
    releaseDateTime,
    recurrence,
    createdBy,
  } = req.body;

  try {
    if (!title) {
      return res
        .status(400)
        .send("Please include the title of your voucher event");
    }

    [
      [title, "title"],
      [discount, "discount"],
      [startDateTime, "start date time"],
      [endDateTime, "end date time"],
      [quantity, "quantity"],
      [releaseDateTime, "release date time"],
      [createdBy, "creator"],
    ].map((each) => {
      if (!each[0]) {
        return res.status(400).send(`Please include the ${each[1]} value`);
      }
    });

    await validateEatery(createdBy, res);

    startDateTime = new Date(req.body.startDateTime);
    endDateTime = new Date(req.body.endDateTime);
    releaseDateTime = new Date(req.body.releaseDateTime);

    // Check constraints
    if (discount <= 0 || discount > 100) {
      return res
        .status(400)
        .send("Please make sure your discount value between from 0 to 100");
    }

    if (startDateTime > endDateTime) {
      return res
        .status(400)
        .send("Please make sure the start date time before the end date time");
    }

    if (releaseDateTime > startDateTime) {
      return res
        .status(400)
        .send(
          "Please make sure the release date time before your start date time"
        );
    }

    if (isRecurring && (!recurrence || recurrence.length === 0)) {
      return res
        .status(400)
        .send("Please provide recurrence rules for your voucher event");
    }

    const voucherSchemaData = {
      ...req.body,
      startDateTime,
      endDateTime,
      releaseDateTime,
    };

    if (!description) {
      voucherSchemaData.description = "";
    }

    return voucherSchemaData;
  } catch (err) {
    console.log("CONSTRUCT VOUCHER FAILED", err);
    return res
      .status(400)
      .send("Failed to construct voucher. Please try again");
  }
};

const createVoucher = async (req, res) => {
  try {
    const voucherSchemaData = await constructVoucher(req, res);

    const voucher = new Voucher(voucherSchemaData);

    console.log("voucher data", voucherSchemaData);

    await voucher.save();

    console.log("saved voucher in database", voucher);
    return res.json({ voucherId: voucher._id });
  } catch (err) {
    console.log("CREATE VOUCHER FAILED", err);
    return res
      .status(400)
      .send("Failed to create voucher event. Please try again");
  }
};

const updateVoucher = async (req, res) => {
  try {
    const voucherId = req.body.voucherId;
    if (!voucherId) {
      return res.status(400).send("Please include the voucher id value");
    }

    const currentDateTime = new Date();
    const releaseDateTime = new Date(req.body.releaseDateTime);

    if (currentDateTime > releaseDateTime) {
      return res
        .status(400)
        .send("Can not update the voucher event after the release date");
    }

    const voucherSchemaData = await constructVoucher(req, res);

    const updatedVoucher = await Voucher.findOneAndUpdate(
      { _id: voucherId },
      voucherSchemaData,
      {
        new: true,
      }
    ).catch((err) => {
      console.log("Failed at find one and update due to", err);
      return res
        .status(400)
        .send("Can not find one and update voucher in the database");
    });

    console.log("updated voucher successfully ", updatedVoucher);

    return res.json({ voucherId });
  } catch (err) {
    console.log("UPDATE VOUCHER FAILED", err);
    return res
      .status(400)
      .send("Failed to update voucher event. Please try again");
  }
};

const getVoucher = async (req, res) => {
  try {
    console.log("eatery id", req.query.eateryId);

    const eateryId = req.query.eateryId;

    await validateEatery(eateryId, res);

    const voucherEvents = await Voucher.find({ createdBy: eateryId }).exec();

    console.log(voucherEvents);

    return res.json({ voucherEvents });
  } catch (err) {
    console.log("GET VOUCHER FAILED", err);
    return res
      .status(400)
      .send("Failed to get voucher events. Please try again");
  }
};

const deleteVoucher = async (req, res) => {
  try {
    console.log("voucher id", req.query.voucherId);
    const voucherId = req.query.voucherId;
    if (!voucherId) {
      return res.status(400).send("Please provide voucher id");
    }

    const voucher = await Voucher.findOne({ _id: voucherId }).exec();
    if (!voucher) return res.status(400).send("Voucher is not found");

    const currentDateTime = new Date();
    const releaseDateTime = voucher.releaseDateTime;

    if (currentDateTime > releaseDateTime) {
      return res
        .status(400)
        .send("Can not update the voucher event after the release date");
    }

    await Voucher.deleteOne({ _id: voucherId }, (err, result) => {
      if (err) {
        console.log("Failed to delete the voucher", err);
        return res.status(400).send("Failed to delete the voucher");
      } else {
        console.log("deleted voucher ", result);
        return res.json({ ok: true });
      }
    });
  } catch (err) {
    console.log("DELETE VOUCHER FAILED", err);
    return res
      .status(400)
      .send("Failed to delete voucher event. Please try again");
  }
};

module.exports = {
  createVoucher,
  updateVoucher,
  getVoucher,
  deleteVoucher,
};
