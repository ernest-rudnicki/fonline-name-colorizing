import { BaseItem, BaseState } from "generic/generic";

export interface FileState extends BaseState {
  colors: ColorGroupHashMap;
  unsavedColors: ColorGroupHashMap;
  selectedColorKey: string | null;
  usernames: Username[];
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorGroup {
  name: string;
  color: RGBColor;
  usernames: Username[];
}

export interface ColorGroupHashMap {
  [key: string]: ColorGroup;
}

export type UsernameFormItemError = {
  [key in keyof Username]: string;
};

export interface Username extends BaseItem {
  name: string;
  contourColorId: string;
  nameColorId: string;
  errors?: Partial<UsernameFormItemError>;
}
