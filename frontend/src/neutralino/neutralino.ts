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

const Neutralino = window.Neutralino as Neutralino;

export default Neutralino;
