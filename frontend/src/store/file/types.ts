import { BaseState } from "generic/generic";

export interface FileState extends BaseState {
  colors: ColorGroupHashMap;
  usernames: Username[];
}

export interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

export interface ColorGroup {
  color: RGBColor | null;
  usernames: Username[];
}

export interface ColorGroupHashMap {
  [key: string]: ColorGroup;
}

export interface Username {
  name: string;
  contourColor: string;
  nameColor: string;
}
