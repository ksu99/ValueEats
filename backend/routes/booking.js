const express = require('express');

const router = express.Router();

const {
  createVoucherCode,
  deleteVoucherCode,
  displayVoucherInstance,
  redeemVoucherCode,
} = require('../controllers/booking/booking');
const { requireLogin, generateVoucherInstance } = require('../middlewares');

router.post('/voucher/code/create', createVoucherCode);
router.delete('/voucher/code/delete', deleteVoucherCode);
router.get('/voucher/display', generateVoucherInstance, displayVoucherInstance);
router.put('/voucher/code/redeem', redeemVoucherCode);

module.exports = router;
