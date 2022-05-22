export const neutralino = {
  init: jest.fn(),
  filesystem: {
    readDirectory: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
  os: {
    showOpenDialog: jest.fn(),
    showSaveDialog: jest.fn(),
  },
};
