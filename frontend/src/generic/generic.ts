import { h } from "preact";

export type PreactMouseEvent = h.JSX.TargetedMouseEvent<HTMLButtonElement>;

export interface BaseState {
  isLoading: boolean;
}
