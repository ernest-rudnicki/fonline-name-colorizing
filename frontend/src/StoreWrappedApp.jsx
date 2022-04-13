import { h } from "preact";
import { Provider } from "react-redux";
import App from "components/App";
import { store } from "store/store";

// React redux Provider is conflicting with the types provided by Preact, therefore I can only provide the store via JavaScript
const StoreWrappedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default StoreWrappedApp;
