import "./style/index.scss";
import { neutralino } from "@neutralino/neutralino";
import App from "@components/app";

if (typeof window !== "undefined") {
  neutralino.init();
}

export default App;
