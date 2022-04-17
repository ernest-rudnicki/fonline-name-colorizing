import { h, VNode } from "preact";

export type PreactMouseEvent = h.JSX.TargetedMouseEvent<HTMLButtonElement>;
export type GenericPreactContent = VNode | string;

export interface BaseState {
  isLoading: boolean;
}
