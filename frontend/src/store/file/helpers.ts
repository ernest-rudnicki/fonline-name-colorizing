import { ColorGroup, ColorTreeItems } from "./types";
import { parseIntBaseTen } from "utils/utils";
import { TreeItem } from "react-complex-tree";

export type TreeItemData = string | ColorGroup;

export function isColorGroup(item: TreeItemData): item is ColorGroup {
  return !!(item as ColorGroup).name;
}

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
    data: {
      name: colorName,
    },
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

export function createUsernameItem(username: string): TreeItem<string> {
  return {
    index: username,
    canMove: true,
    hasChildren: false,
    data: username,
  };
}

export function fillTree(
  treeItems: ColorTreeItems,
  colorName: string,
  username?: string
): ColorTreeItems {
  const nameColorItem = `name${colorName}`;
  const nameContourItem = `contour${colorName}`;
  let treeItemsCopy = { ...treeItems };

  if (!treeItemsCopy[colorName]) {
    treeItemsCopy = {
      ...treeItemsCopy,
      ...createColorItem(colorName, nameColorItem, nameContourItem),
    };
    treeItemsCopy["root"].children?.push(colorName);
  }

  if (!username) {
    return treeItemsCopy;
  }

  treeItemsCopy[nameColorItem].children?.push(username);
  return treeItemsCopy;
}

export function parseFileContent(content: string[]): ColorTreeItems {
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

      treeItems = fillTree(treeItems, nameColor, username);
      treeItems = fillTree(treeItems, contourColor, username);

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

      treeItems = fillTree(treeItems, colorName);

      const treeItemData = treeItems[colorName].data;
      if (!isColorGroup(treeItemData)) {
        return;
      }

      treeItems[colorName].data = {
        ...treeItemData,
        color: {
          red: parseIntBaseTen(red),
          green: parseIntBaseTen(green),
          blue: parseIntBaseTen(blue),
        },
      };

      return;
    }
  });

  return treeItems;
}
