import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notification: null,
    auth:null
  },
  reducers: {
    showNotification (state,action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    } ,
    hideNotification(state) {
      state.notification=null
    },
    errorAuth(state,action) {
      state.auth={
        status:action.payload.status,
        message:action.payload.message
      }
    },
    hideErrorAuth(state) {
      state.auth={}
    }


  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
