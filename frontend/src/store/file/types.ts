import { BaseState } from "generic/generic";
import { TreeItem } from "react-complex-tree";

export interface FileState extends BaseState {
  colors: ColorTreeItems;
}

export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

export type ColorTreeItems = { [key: string]: TreeItem };

export interface ColorGroup {
  color: RGBColor;
  coloredNames: string[];
  contourUsernames: string[];
}
