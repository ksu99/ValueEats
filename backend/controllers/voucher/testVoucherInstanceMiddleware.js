import User from '../../models/user';
import Voucher from '../../models/voucher';
const testVoucherInstanceMiddleware = (req, res) => {
  return res.json({ ok: true });
};

module.exports = {
  testVoucherInstanceMiddleware,
};
