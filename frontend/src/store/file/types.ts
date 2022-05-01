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

export interface Username extends BaseItem {
  name: string;
  contourColorId: string;
  nameColorId: string;
}

export type UsernameFormItemError = {
  [key in keyof Username]: string;
};

export interface UsernameFormItem extends Username {
  errors?: Partial<UsernameFormItemError>;
}
