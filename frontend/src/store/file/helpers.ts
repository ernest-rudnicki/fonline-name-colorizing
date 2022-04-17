import { ColorTreeItems } from "./types";
import { parseIntBaseTen } from "utils/utils";
import { TreeItem } from "react-complex-tree";

export function createColorItem(
  colorName: string,
  nameGroup: string,
  contourGroup: string
): ColorTreeItems {
  const colorGroup: ColorTreeItems = {};

  colorGroup[colorName] = {
    index: colorName,
    canMove: false,
    hasChildren: true,
    children: [nameGroup, contourGroup],
    data: colorName,
  };

  colorGroup[nameGroup] = {
    index: nameGroup,
    canMove: false,
    hasChildren: true,
    children: [],
    data: "Name Color",
  };

  colorGroup[contourGroup] = {
    index: contourGroup,
    canMove: false,
    hasChildren: true,
    children: [],
    data: "Contour Color",
  };

  return colorGroup;
}

export function createUsernameItem(username: string): TreeItem {
  return {
    index: username,
    canMove: true,
    hasChildren: false,
    data: username,
  };
}

export function parseFileContent(content: string[]): {
  [key: string]: TreeItem;
} {
  let treeItems: ColorTreeItems = {
    root: {
      index: "root",
      canMove: true,
      hasChildren: true,
      children: [],
      data: "root",
    },
  };

  content.forEach((el) => {
    const splittedLine = el.split(" ");

    if (el.startsWith(">")) {
      if (splittedLine.length !== 4) {
        return;
      }

      const username = splittedLine[1];
      const nameColor = splittedLine[2];
      const contourColor = splittedLine[3];

      const nameColorItem = `name${nameColor}`;
      const nameContourItem = `contour${nameColor}`;

      if (!treeItems[nameColor]) {
        treeItems = {
          ...treeItems,
          ...createColorItem(nameColor, nameColorItem, nameContourItem),
        };
        treeItems["root"].children?.push(nameColor);
      }
      treeItems[nameColorItem].children?.push(username);

      const contourColorItem = `name${contourColor}`;
      const contourItem = `contour${contourColor}`;

      if (!treeItems[contourColor]) {
        treeItems = {
          ...treeItems,
          ...createColorItem(contourColor, contourColorItem, contourItem),
        };
        treeItems["root"].children?.push(contourColor);
      }
      treeItems[contourItem].children?.push(username);

      treeItems = {
        ...treeItems,
        [username]: createUsernameItem(username),
      };

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

      const color = `name${colorName}`;
      const contour = `contour${colorName}`;

      if (!treeItems[colorName]) {
        treeItems = {
          ...treeItems,
          ...createColorItem(colorName, color, contour),
        };
        treeItems["root"].children?.push(colorName);
      }

      // treeItems[colorName].data.red = parseIntBaseTen(red);
      // treeItems[colorName].data.green = parseIntBaseTen(green);
      // treeItems[colorName].data.blue = parseIntBaseTen(blue);
      return;
    }
  });

  return treeItems;
}
