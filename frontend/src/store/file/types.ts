import { BaseState } from "generic/generic";
import { TreeItem } from "react-complex-tree";
import { TreeItemData } from "./helpers";

export interface FileState extends BaseState {
  colors: ColorTreeItems;
}

export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

export type ColorTreeItems = { [key: string]: TreeItem<TreeItemData> };

export interface ColorGroup {
  name: string;
  color?: RGBColor;
}
