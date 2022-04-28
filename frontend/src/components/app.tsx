import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Editor from "routes/Editor/Editor";
import Start from "routes/Start/Start";

import "antd/dist/antd.less";

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Start} />
        <Route path="/editor" component={Editor} />
      </Router>
    </div>
  );
};

export default App;
