import { createCustomSlice } from "store/store-utils";
import { readFileContent } from "./actions";
import { FileState } from "./types";

const initialState: FileState = {
  colors: {},
  isLoading: false,
};

export const fileSlice = createCustomSlice(
  {
    name: "file",
    initialState,
    reducers: {},
  },
  undefined,
  (builder) => {
    builder.addCase(readFileContent.fulfilled, (state, response) => {
      state.colors = response.payload;
    });
  }
);

export const fileReducer = fileSlice.reducer;
