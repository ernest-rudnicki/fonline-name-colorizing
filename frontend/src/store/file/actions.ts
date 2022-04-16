import { neutralino } from "neutralino/neutralino";
import { createCustomThunk } from "store/store-utils";
import { removeAdditionalSpaces, splitByNewLine } from "utils/utils";
import { parseFileContent } from "./helpers";

export const readFileContent = createCustomThunk(
  "file/readFileContent",
  (path: string) =>
    neutralino.filesystem.readFile<string>(path).then((fileContent) => {
      const lines = splitByNewLine(removeAdditionalSpaces(fileContent));
      return parseFileContent(lines);
    })
);
