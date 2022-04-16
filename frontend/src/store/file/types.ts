import { BaseState } from "generic/generic";

export interface FileState extends BaseState {
  colors: Colors;
}

export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

export interface Colors {
  [key: string]: ColorGroup;
}

export interface ColorGroup {
  color: RGBColor;
  coloredNames: string[];
  contourUsernames: string[];
}
