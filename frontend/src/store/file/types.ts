import { BaseItem, BaseState } from "generic/generic";

export interface FileState extends BaseState {
  colors: ColorGroupHashMap;
  selectedColorKey: string | null;
  usernames: Username[];
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorGroup extends BaseItem {
  color: RGBColor;
  usernames: Username[];
}

export interface ColorGroupHashMap {
  [key: string]: ColorGroup;
}

export interface Username extends BaseItem {
  name: string;
  contourColor: string;
  nameColor: string;
}

export type UsernameFormItemError = {
  [key in keyof Username]: string;
};

export interface UsernameFormItem extends Username {
  errors?: Partial<UsernameFormItemError>;
}
