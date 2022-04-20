import { ColorGroupHashMap, Username } from "./types";
import { parseIntBaseTen } from "utils/utils";

export function createUsernameObject(
  username: string,
  nameColor: string,
  contourColor: string
): Username {
  return {
    name: username,
    nameColor,
    contourColor,
  };
}

export function fillColors(
  color: string,
  hashMap: ColorGroupHashMap,
  username?: Username
): void {
  if (!hashMap[color]) {
    hashMap[color] = {
      usernames: [],
      color: null,
    };
  }

  if (username) {
    hashMap[color].usernames.push(username);
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

      const usernameObject = createUsernameObject(
        textUsername,
        nameColor,
        contourColor
      );

      usernames.push(usernameObject);

      fillColors(nameColor, colors, usernameObject);
      fillColors(contourColor, colors, usernameObject);

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

      fillColors(colorName, colors);

      colors[colorName].color = {
        red: parseIntBaseTen(red),
        green: parseIntBaseTen(green),
        blue: parseIntBaseTen(blue),
      };

      return;
    }
  });

  return { colors, usernames };
}
