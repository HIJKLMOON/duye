import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReactNode } from "react";

interface HeaderState {
  extra: ReactNode | null;
}

const initialState: HeaderState = {
  extra: null,
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderExtra(state, action: PayloadAction<ReactNode | null>) {
      state.extra = action.payload;
    },
  },
});

export const { setHeaderExtra } = headerSlice.actions;
export default headerSlice.reducer;
