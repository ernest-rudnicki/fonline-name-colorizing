import { neutralino } from "neutralino/neutralino";
import StoreWrappedApp from "./StoreWrappedApp";
import "./style/index.scss";

if (typeof window !== "undefined") {
  neutralino.init();
}

export default StoreWrappedApp;
