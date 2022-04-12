module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "preact",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  settings: {
    react: {
      pragma: "h",
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
  ignorePatterns: ["node_modules/", "build/"],
};
