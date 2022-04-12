import "./style/index.css";
import App from "./components/app";

declare global {
  interface Window {
    Neutralino: any;
  }
}

if (typeof window !== "undefined") {
  window.Neutralino.init();
}

export default App;
