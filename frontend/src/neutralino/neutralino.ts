// There are no Neutralino types available on the npm, therefore I had to write types myself
// Refer to https://neutralino.js.org/docs/api/overview

export enum DirectoryItem {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface Directory {
  entry: string;
  type: DirectoryItem;
}

export interface NeutralinoFileSystem {
  readDirectory: (path: string) => Promise<Directory[]>;
  readFile: (filename: string) => Promise<unknown>;
}

export interface Neutralino {
  init: () => void;
  filesystem: NeutralinoFileSystem;
}

declare global {
  interface Window {
    Neutralino: Neutralino;
  }
}

export const neutralino = window.Neutralino;
