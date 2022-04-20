import { PayloadAction } from "@reduxjs/toolkit";
import { TreeItem } from "react-complex-tree";
import { createCustomSlice } from "store/store-utils";
import { readFileContent } from "./actions";
import { ColorGroup, FileState } from "./types";

const initialState: FileState = {
  isLoading: false,
  treeItems: {},
  selectedTreeItem: null,
};

export const fileSlice = createCustomSlice(
  {
    name: "file",
    initialState,
    reducers: {
      changeSelectedColor: (
        state,
        action: PayloadAction<TreeItem<ColorGroup>>
      ) => {
        console.log(action.payload);
        state.selectedTreeItem = action.payload;
      },
    },
  },
  undefined,
  (builder) => {
    builder.addCase(readFileContent.fulfilled, (state, action) => {
      console.log(action.payload);
      state.treeItems = action.payload;
    });
  }
);

export const fileReducer = fileSlice.reducer;
export const { changeSelectedColor } = fileSlice.actions;
