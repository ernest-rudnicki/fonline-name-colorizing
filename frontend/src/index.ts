import "./style/index.scss";
import App from "./components/app";
import Neutralino from "./neutralino/neutralino";

if (typeof window !== "undefined") {
  Neutralino.init();
}

export default App;
