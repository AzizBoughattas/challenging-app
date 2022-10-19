import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import modalSlice from "./modal";
import quizSlice from "./quiz";
import uiSlice from "./ui-actions";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    modal: modalSlice.reducer,
    ui: uiSlice.reducer,
    quiz: quizSlice.reducer,
  },
});

export default store;
