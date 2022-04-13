import { createSlice } from "@reduxjs/toolkit";
import { FileState } from "./types";

const initialState: FileState = {
  test: "Goodbye world",
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
});

export const fileReducer = fileSlice.reducer;
