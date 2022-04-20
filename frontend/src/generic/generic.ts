import { h, VNode } from "preact";

export type PreactMouseEvent = h.JSX.TargetedMouseEvent<HTMLButtonElement>;
export type GenericPreactContent = VNode | string;

export interface BaseState {
  isLoading: boolean;
}
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
