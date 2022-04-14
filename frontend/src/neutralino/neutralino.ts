// There are no Neutralino types available on the npm, therefore I had to write types myself
// Refer to https://neutralino.js.org/docs/api/overview

export enum DirectoryItem {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface DirectoryEntries {
  entry: string;
  type: DirectoryItem;
}

export interface Filter {
  name: string;
  extensions: string[];
}

export interface ShowDialogOptions {
  filters: Filter[];
  multiSelections?: boolean;
}

export interface NeutralinoFileSystem {
  readDirectory: (path: string) => Promise<DirectoryEntries[]>;
  readFile: (filename: string) => Promise<unknown>;
}

export interface NeutralinoOS {
  showOpenDialog: (
    title: string,
    options: ShowDialogOptions
  ) => Promise<DirectoryEntries>;
}

export interface Neutralino {
  init: () => void;
  filesystem: NeutralinoFileSystem;
  os: NeutralinoOS;
}

declare global {
  interface Window {
    Neutralino: Neutralino;
  }
}

export const neutralino = window.Neutralino;
