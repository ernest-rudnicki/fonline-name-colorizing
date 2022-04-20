import { PayloadAction } from "@reduxjs/toolkit";
import { createCustomSlice } from "store/store-utils";
import { readFileContent } from "./actions";
import { ColorGroup, FileState } from "./types";

const initialState: FileState = {
  isLoading: false,
  usernames: [],
  colors: {},
};

export const fileSlice = createCustomSlice(
  {
    name: "file",
    initialState,
    reducers: {
      changeSelectedColor: (state, action: PayloadAction<ColorGroup>) => {
        console.log(action.payload);
        // state.selectedTreeItem = action.payload;
      },
    },
  },
  undefined,
  (builder) => {
    builder.addCase(readFileContent.fulfilled, (state, action) => {
      console.log(action.payload);
      state.colors = action.payload.colors;
      state.usernames = action.payload.usernames;
    });
  }
);

export const fileReducer = fileSlice.reducer;
export const { changeSelectedColor } = fileSlice.actions;
