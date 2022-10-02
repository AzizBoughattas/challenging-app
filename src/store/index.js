import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import modalSlice from "./modal";

const store = configureStore({
  reducer: { auth: authSlice.reducer,modal:modalSlice.reducer },
});

export default store;
