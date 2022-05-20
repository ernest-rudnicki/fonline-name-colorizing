import { PayloadAction } from "@reduxjs/toolkit";
import { createCustomSlice } from "store/store-utils";
import { readFileContent } from "./actions";
import { ColorGroupHashMap, FileState, SaveColorChangesPayload } from "./types";

const initialState: FileState = {
  isLoading: false,
  usernames: [],
  selectedColorKey: null,
  colors: {},
  unsavedColors: {},
};

export const fileSlice = createCustomSlice(
  {
    name: "file",
    initialState,
    reducers: {
      changeSelectedColor: (state, action: PayloadAction<string | null>) => {
        state.selectedColorKey = action.payload;
      },
      updateUnsavedColors: (
        state,
        action: PayloadAction<ColorGroupHashMap>
      ) => {
        state.unsavedColors = action.payload;
      },
      updateColors: (state, action: PayloadAction<ColorGroupHashMap>) => {
        state.colors = action.payload;
      },
      saveColorChanges: (
        state,
        action: PayloadAction<SaveColorChangesPayload>
      ) => {
        state.colors = action.payload.colors;
        state.usernames = action.payload.usernames;
        state.unsavedColors = action.payload.unsavedColors;
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
export const {
  changeSelectedColor,
  updateUnsavedColors,
  saveColorChanges,
  updateColors,
} = fileSlice.actions;
