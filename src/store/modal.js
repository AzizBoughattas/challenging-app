import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalShow: false,
    modalInfo: {
      title: "",
      facebookContent: "",
      googleContent: "",
      status: "",
    },
  },
  reducers: {
    signIn(state) {
      state.modalShow = true;
      state.modalInfo.facebookContent = "Sign In with Facebook";
      state.modalInfo.googleContent = "Sign In with google";
      state.modalInfo.status = "Sign in";
      state.modalInfo.title = "Sign In to an Existing Account";
    },
    signUp(state) {
      state.modalShow = true;
      state.modalInfo.facebookContent = "Sign Up with Facebook";
      state.modalInfo.googleContent = "Sign Up with google";
      state.modalInfo.status = "Sign up";
      state.modalInfo.title = "Sign Up to an Existing Account";
    },
    closeModal(state) {
      state.modalShow = false;
    }
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice;
