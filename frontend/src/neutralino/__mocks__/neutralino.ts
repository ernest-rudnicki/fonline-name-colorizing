export const neutralino = {
  init: jest.fn(),
  filesystem: {
    readDirectory: jest.fn(),
    readFile: jest.fn(),
  },
  os: {
    showOpenDialog: jest.fn(),
  },
};
