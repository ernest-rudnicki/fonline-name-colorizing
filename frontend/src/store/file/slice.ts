import { createCustomSlice } from "store/store-utils";
import { removeAdditionalSpaces, splitByNewLine } from "utils/utils";
import { readFileContent } from "./actions";
import { parseFileContent } from "./helpers";
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
      const lines = splitByNewLine(removeAdditionalSpaces(response.payload));
      state.colors = parseFileContent(lines);
      console.log(state.colors);
    });
  }
);

export const fileReducer = fileSlice.reducer;
