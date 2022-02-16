import { createSlice } from "@reduxjs/toolkit";

const page = createSlice({
  name: "page",
  initialState: {
    page: 0,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { setPage } = page.actions;

export default page.reducer;
