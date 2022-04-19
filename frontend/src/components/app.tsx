import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Editor from "routes/editor";
import Start from "routes/start";

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
