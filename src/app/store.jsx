import { configureStore } from "@reduxjs/toolkit";
import formSlice from "../app/formSlice";

export const store = configureStore({
  reducer: {
    formdata: formSlice,
  },
});
