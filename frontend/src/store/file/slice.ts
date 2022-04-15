import { createCustomSlice } from "store/store-utils";
import { FileState } from "./types";

const initialState: FileState = {
  test: "Goodbye world",
  isLoading: false,
};

export const fileSlice = createCustomSlice({
  name: "file",
  initialState,
  reducers: {},
});

export const fileReducer = fileSlice.reducer;
