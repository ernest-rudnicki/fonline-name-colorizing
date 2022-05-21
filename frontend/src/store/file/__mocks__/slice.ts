export const changeSelectedColor = jest.fn(() => ({
  type: "file/changeSelectedColor",
}));

export const updateUnsavedColors = jest.fn(() => ({
  type: "file/updateUnsavedColors",
}));

export const saveColorChanges = jest.fn(() => ({
  type: "file/saveColorChanges",
}));

export const updateColors = jest.fn(() => ({
  type: "file/updateColorChanges",
}));

export const changeValidation = jest.fn(() => ({
  type: "file/changeValidation",
}));
