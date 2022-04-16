import { neutralino } from "neutralino/neutralino";
import { createCustomThunk } from "store/store-utils";

export const readFileContent = createCustomThunk(
  "file/readFileContent",
  (path: string) => neutralino.filesystem.readFile<string>(path)
);
