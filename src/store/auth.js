import { createSlice } from "@reduxjs/toolkit";

// const calculateRemainingTime = () => {
//   const currentTime = new Date().getTime();
//   const adjExpirationTime = 3600000 * 3;

//   const remainingDuration = adjExpirationTime - currentTime;

//   return remainingDuration;
// };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token:localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).token : "",
    email: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).email : "" ,
    nickname: "",
    isAdmin: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).isAdmin : false,
    isAuthenticated: localStorage.getItem("userData") ? true : false,
    inputValidity: false,
    modal: false,
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = "";
      state.email = "";
      state.nickname = "";
      state.isAdmin = false;
      localStorage.removeItem("userData");
    },
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.data.token;
      state.email = action.payload.data.email;
      state.nickname = action.payload.data.nickname;
      state.isAdmin = action.payload.data.isAdmin;
      const userData = {
        token: state.token,
        email: state.email,
        nickname: state.nickname,
        isAdmin: state.isAdmin,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    showModal(state) {
      state.modal = true;
    },
    hideModal(state) {
      state.modal = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
