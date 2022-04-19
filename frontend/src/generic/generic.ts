import { h, VNode } from "preact";
import {
  TreeInformation,
  TreeItem,
  TreeItemRenderContext,
} from "react-complex-tree";

export type PreactMouseEvent = h.JSX.TargetedMouseEvent<HTMLButtonElement>;
export type GenericPreactContent = VNode | string;

export interface BaseState {
  isLoading: boolean;
}

export interface TreeItemProps<T> {
  title: string;
  item: TreeItem<T>;
  context: TreeItemRenderContext;
  info: TreeInformation;
}
