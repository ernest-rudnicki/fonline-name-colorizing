import { h } from "preact";
import { Provider } from "react-redux";
import App from "./components/App";
import { store } from "./store/store";

const StoreWrappedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default StoreWrappedApp;
