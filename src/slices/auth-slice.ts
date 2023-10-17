import { createSlice } from "@reduxjs/toolkit";

//if present in local storage use it or else null initially
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = JSON.parse(action.payload.res);
      localStorage.setItem("userInfo", action.payload.res);
    },
    logOut: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
