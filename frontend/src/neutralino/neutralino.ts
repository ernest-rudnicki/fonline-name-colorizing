// There are no Neutralino types available on the npm, therefore I had to write types myself
export interface Neutralino {
  init: () => void;
}

const Neutralino = window.Neutralino as Neutralino;

export default Neutralino;
