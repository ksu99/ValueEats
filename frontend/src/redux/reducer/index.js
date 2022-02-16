import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/auth.slice";
import pageReducer from "../slices/page.slice";
import voucherReducer from "../slices/voucher.slice";
import browsingReducer from "../slices/browsing.slice";

export default combineReducers({
  auth: authReducer,
  page: pageReducer,
  voucher: voucherReducer,
  browsing: browsingReducer,
});
