import { createSlice } from "@reduxjs/toolkit";

const voucher = createSlice({
  name: "voucher",
  initialState: {
    voucher: [],
  },
  reducers: {
    setVoucher(state, action) {
      state.voucher = action.payload;
    },
    resetVoucher(state) {
      state.voucher = [];
    },
  },
});

export const { setVoucher, resetVoucher } = voucher.actions;

export default voucher.reducer;
