import { h, VNode } from "preact";

export enum DirectoryItem {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export type PreactMouseEvent = h.JSX.TargetedMouseEvent<HTMLButtonElement>;
export type PreactInputEvent = h.JSX.TargetedEvent<HTMLInputElement, Event>;
export type GenericPreactContent = VNode | string;

export interface BaseState {
  isLoading: boolean;
}

export interface BaseItem {
  id: string;
}
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
