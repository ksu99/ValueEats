import { createSlice } from "@reduxjs/toolkit";

const browsing = createSlice({
  name: "browsing",
  initialState: {
    isSearchedByTime: "",
    isCuisine: false,
  },
  reducers: {
    setDate(state, action) {
      state.isSearchedByTime = action.payload;
    },
    setCuisine(state, action) {
      state.isCuisine = action.payload;
    },
    resetBrowse(state, action) {
      state.isSearchedByTime = "";
      state.isCuisine = false;
    },
  },
});

export const { setDate, resetBrowse, setCuisine } = browsing.actions;

export default browsing.reducer;
