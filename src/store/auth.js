import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    inputValidity: false,
    modal:false
  },
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    showModal(state) {
      state.modal=true
    },
    hideModal(state) {
      state.modal=false
    }
  },
});

export const authActions = authSlice.actions;
export default authSlice;
