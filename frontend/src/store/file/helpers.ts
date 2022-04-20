import {
  ColorGroup,
  ColorTreeItems,
  TreeItemData,
  TreeItemNodeData,
} from "./types";
import { parseIntBaseTen } from "utils/utils";
import { TreeItem } from "react-complex-tree";

export function isColorGroup(item: TreeItemData): item is ColorGroup {
  return !!(item as ColorGroup).color;
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
      rootParent: null,
    },
  };

  colorGroup[nameGroup] = {
    index: nameGroup,
    canMove: false,
    hasChildren: false,
    children: [],
    data: {
      name: "Name Color",
      rootParent: colorGroup[colorName],
    },
  };

  colorGroup[contourGroup] = {
    index: contourGroup,
    canMove: false,
    hasChildren: false,
    children: [],
    data: {
      name: "Contour Color",
      rootParent: colorGroup[colorName],
    },
  };

  return colorGroup;
}

export function createUsernameItem(
  username: string,
  rootParent: TreeItem<ColorGroup>
): TreeItem<TreeItemNodeData> {
  return {
    index: username,
    canMove: true,
    hasChildren: false,
    data: {
      name: username,
      rootParent,
    },
  };
}

export function fillTree(
  treeItems: ColorTreeItems,
  colorName: string,
  username?: string,
  place?: "name" | "contour"
): ColorTreeItems {
  const nameItem = `name${colorName}`;
  const contourItem = `contour${colorName}`;
  let treeItemsCopy = { ...treeItems };

  if (!treeItemsCopy[colorName]) {
    treeItemsCopy = {
      ...treeItemsCopy,
      ...createColorItem(colorName, nameItem, contourItem),
    };
    treeItemsCopy["root"].children?.push(colorName);
  }

  if (!username) {
    return treeItemsCopy;
  }

  if (place === "name") {
    treeItemsCopy[nameItem].children?.push(place + username);
    treeItemsCopy[nameItem].hasChildren = true;
  } else {
    treeItemsCopy[contourItem].children?.push(place + username);
    treeItemsCopy[contourItem].hasChildren = true;
  }

  return treeItemsCopy;
}

export function parseFileContent(content: string[]): ColorTreeItems {
  let treeItems: ColorTreeItems = {
    root: {
      index: "root",
      canMove: true,
      hasChildren: true,
      children: [],
      data: {
        name: "root",
        rootParent: null,
      },
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

      treeItems = fillTree(treeItems, nameColor, username, "name");
      treeItems = fillTree(treeItems, contourColor, username, "contour");

      treeItems = {
        ...treeItems,
        [`name${username}`]: createUsernameItem(username, treeItems[nameColor]),
      };

      treeItems = {
        ...treeItems,
        [`contour${username}`]: createUsernameItem(
          username,
          treeItems[contourColor]
        ),
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
