export const CURRENT_DIR =
  process.env.NODE_ENV === "development" ? "./dev-testing/" : "./";
export const NAME_COLORIZING_FILE_NAME = "NameColorizing.txt";
export const NAME_COLORIZING_FILE_FILTERS = [
  { name: "Text files", extensions: ["txt"] },
];
