import { ColorGroupHashMap, Username, UsernameState } from "./types";
import { getEntries, parseIntBaseTen } from "utils/utils";
import { v4 as uuidv4 } from "uuid";

export function createUsernameObject(
  username: string,
  nameColorId: string,
  contourColorId: string
): Username {
  return {
    id: uuidv4(),
    name: username,
    nameColorId,
    contourColorId,
    state: UsernameState.ORIGINAL,
  };
}

export function fillColors(
  color: string,
  hashMap: ColorGroupHashMap,
  colorKey: string,
  username?: Username
): void {
  if (!hashMap[colorKey]) {
    hashMap[colorKey] = {
      name: color,
      usernames: [],
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
    };
  }

  if (username) {
    hashMap[colorKey].usernames.push(username);
  }
}

export function parseFileContent(content: string[]): {
  colors: ColorGroupHashMap;
  usernames: Username[];
} {
  const colors: ColorGroupHashMap = {};
  const usernames: Username[] = [];

  content.forEach((el) => {
    const splittedLine = el.split(" ");

    if (el.startsWith(">")) {
      if (splittedLine.length !== 4) {
        return;
      }

      const textUsername = splittedLine[1];
      const nameColor = splittedLine[2];
      const contourColor = splittedLine[3];
      const entries = getEntries(colors);

      const nameColorEntry = entries.find(
        ([, value]) => value.name === nameColor
      );
      const contourColorEntry = entries.find(
        ([, value]) => value.name === contourColor
      );

      const nameColorId = nameColorEntry ? nameColorEntry[0] : uuidv4();
      const contourColorId = contourColorEntry
        ? contourColorEntry[0]
        : uuidv4();

      const usernameObject = createUsernameObject(
        textUsername,
        nameColorId,
        contourColorId
      );

      usernames.push(usernameObject);

      fillColors(nameColor, colors, nameColorId, usernameObject);
      fillColors(contourColor, colors, contourColorId, usernameObject);

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

      const colorEntry = getEntries(colors).find(
        ([, value]) => value.name === colorName
      );

      const colorKey = colorEntry ? colorEntry[0] : uuidv4();
      fillColors(colorName, colors, colorKey);

      colors[colorKey].color = {
        r: parseIntBaseTen(red),
        g: parseIntBaseTen(green),
        b: parseIntBaseTen(blue),
      };

      return;
    }
  });

  return { colors, usernames };
}
