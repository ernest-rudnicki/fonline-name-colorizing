import { PayloadAction } from "@reduxjs/toolkit";
import { createCustomSlice } from "store/store-utils";
import { readFileContent } from "./actions";
import { FileState } from "./types";

const initialState: FileState = {
  isLoading: false,
  usernames: [],
  selectedColorKey: null,
  colors: {},
};

export const fileSlice = createCustomSlice(
  {
    name: "file",
    initialState,
    reducers: {
      changeSelectedColor: (state, action: PayloadAction<string | null>) => {
        state.selectedColorKey = action.payload;
      },
    },
  },
  undefined,
  (builder) => {
    builder.addCase(readFileContent.fulfilled, (state, action) => {
      state.colors = action.payload.colors;
      state.usernames = action.payload.usernames;
    });
  }
);

export const fileReducer = fileSlice.reducer;
export const { changeSelectedColor } = fileSlice.actions;
