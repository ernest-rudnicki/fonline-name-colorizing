import { BaseItem } from "generic/generic";

export interface FileState {
  colors: ColorGroupHashMap;
  unsavedColors: ColorGroupHashMap;
  selectedColorKey: string | null;
  usernames: Username[];
  triggeredValidation: boolean;
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

export enum UsernameState {
  NONE,
  UNSAVED,
  DELETED,
  CHANGED_NAME_COLOR,
  CHANGED_CONTOUR_COLOR,
  ORIGINAL,
}

export interface Username extends BaseItem {
  name: string;
  contourColorId: string;
  nameColorId: string;
  errors?: Partial<UsernameFormItemError>;
  state: UsernameState;
}

export interface SaveColorChangesPayload {
  colors: ColorGroupHashMap;
  unsavedColors: ColorGroupHashMap;
  usernames: Username[];
}
