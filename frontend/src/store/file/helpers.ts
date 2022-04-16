import { colorGroupTemplate } from "reusable-structures/reusable-structures";
import { Colors } from "./types";
import cloneDeep from "lodash.clonedeep";
import { parseIntBaseTen } from "utils/utils";

export function parseFileContent(content: string[]): Colors {
  const colorHashMap: Colors = {};

  content.forEach((el) => {
    const splittedLine = el.split(" ");

    if (el.startsWith(">")) {
      if (splittedLine.length !== 4) {
        return;
      }

      const username = splittedLine[1];
      const nameColor = splittedLine[2];
      const countourColor = splittedLine[3];

      if (!colorHashMap[nameColor]) {
        colorHashMap[nameColor] = cloneDeep(colorGroupTemplate);
      }

      if (!colorHashMap[countourColor]) {
        colorHashMap[countourColor] = cloneDeep(colorGroupTemplate);
      }

      colorHashMap[nameColor].coloredNames.push(username);
      colorHashMap[countourColor].contourUsernames.push(username);

      return;
    }

    if (el.startsWith("@")) {
      if (splittedLine.length !== 5) {
        return;
      }

      const colorName = splittedLine[1];
      const red = splittedLine[2];
      const green = splittedLine[3];
      const blue = splittedLine[4];

      if (!colorHashMap[colorName]) {
        colorHashMap[colorName] = cloneDeep(colorGroupTemplate);
      }

      colorHashMap[colorName].color.red = parseIntBaseTen(red);
      colorHashMap[colorName].color.green = parseIntBaseTen(green);
      colorHashMap[colorName].color.blue = parseIntBaseTen(blue);
      return;
    }
  });

  return colorHashMap;
}
