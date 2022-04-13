// There are no Neutralino types available on the npm, therefore I had to write types myself
// Refer to https://neutralino.js.org/docs/api/overview

export interface NeutralinoFileSystem {
  readDirectory: (
    path: string
  ) => Promise<Array<{ entry: string; type: "FILE" | "DIRECTORY" }>>;
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
