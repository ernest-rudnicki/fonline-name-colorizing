import "./style/index.css";
import App from "./components/app";
import "./declaration";

import Neutralino from "./neutralino/neutralino";

if (typeof window !== "undefined") {
  Neutralino.init();
}

export default App;
