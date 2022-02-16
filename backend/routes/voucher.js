const express = require("express");

const router = express.Router();

const {
  createVoucher,
  updateVoucher,
  getVoucher,
  deleteVoucher,
} = require("../controllers/voucher/voucher");

const {
  testVoucherInstanceMiddleware,
} = require("../controllers/voucher/testVoucherInstanceMiddleware");
const { requireLogin, generateVoucherInstance } = require("../middlewares");

router.post("/voucher/create-voucher-event", createVoucher);
router.get(
  "/voucher/test-voucher-instance-middleware",
  generateVoucherInstance,
  testVoucherInstanceMiddleware
);
router.put("/voucher/update-voucher-event", updateVoucher);
router.get("/voucher/get-voucher-event", getVoucher);
router.delete("/voucher/delete-voucher-event", deleteVoucher);

module.exports = router;
