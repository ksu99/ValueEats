import { createSlice } from "@reduxjs/toolkit";

const auth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : { token: "", user: {} };

const authSlice = createSlice({
  name: "auth",
  initialState: auth,
  reducers: {
    setAuth(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
