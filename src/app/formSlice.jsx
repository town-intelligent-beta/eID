import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step1: {
    name: "",
    organization: "",
    gender: "",
  },
  step2: {
    1: { radio: "", textField: "" },
    2: { radio: "", textField: "" },
    3: { radio: "", textField: "" },
    4: { radio: "", textField: "" },
    5: { radio: "", textField: "" },
    6: { radio: "", textField: "" },
  },
  step3: {
    1.1: "",
    1.2: "",
    "1.2.1": "",
    2.1: "",
    "2.1.1": "",
    2.2: "",
    "2.2.1": "",
    2.3: "",
    "2.3.1": "",
    2.4: "",
    "2.4.1": "",
    2.5: "",
    "2.5.1": "",
    2.6: "",
    "2.6.1": "",
    3.1: "",
    "3.1.1": "",
    "3.1.2": "",
  },
};

export const FormDataSlice = createSlice({
  name: "FormData",
  initialState: initialState,
  reducers: {
    setStep1FormData: (state, action) => {
      state.step1 = action.payload;
    },
    setStep2FormData: (state, action) => {
      state.step2 = action.payload;
    },
    setStep3FormData: (state, action) => {
      state.step3 = action.payload;
    },
  },
});

export const { setStep1FormData, setStep2FormData, setStep3FormData } =
  FormDataSlice.actions;

export default FormDataSlice.reducer;
