module.exports = async () => {
  return {
    preset: "jest-preset-preact",
    setupFiles: [
      "<rootDir>/tests/__mocks__/browserMocks.ts",
      "<rootDir>/tests/__mocks__/setupTests.ts",
    ],
    moduleNameMapper: {
      "^components/(.*)$": "<rootDir>/src/components/$1",
      "^store/(.*)$": "<rootDir>/src/store/$1",
      "^routes/(.*)$": "<rootDir>/src/routes/$1",
      "^utils/(.*)$": "<rootDir>/src/utils/$1",
      "^neutralino/(.*)$": "<rootDir>/src/neutralino/$1",
      "^constants/(.*)$": "<rootDir>/src/constants/$1",
      "^generic/(.*)$": "<rootDir>/src/generic/$1",
    },
    coveragePathIgnorePatterns: [
      "neutralino",
      "assets",
      "constants",
      "generic",
      "store-utils.ts",
      "store.ts",
      "StoreWrappedApp.jsx",
      "App.tsx",
      "sw.js",
      "slice.ts",
      "types.ts",
      "src/index.ts",
      "testing-utils.ts",
    ],
  };
};
