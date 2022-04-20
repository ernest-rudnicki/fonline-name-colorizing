import { BaseState } from "generic/generic";
import { TreeItem } from "react-complex-tree";

export interface FileState extends BaseState {
  treeItems: ColorTreeItems;
  selectedTreeItem: TreeItem<ColorGroup> | null;
}

export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}
export interface TreeItemNodeData {
  name: string;
  rootParent: TreeItem<ColorGroup> | null;
}

export interface ColorGroup extends TreeItemNodeData {
  color?: RGBColor;
}

export type TreeItemData = ColorGroup | TreeItemNodeData;

export type ColorTreeItems = { [key: string]: TreeItem<TreeItemData> };
