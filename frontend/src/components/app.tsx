import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "routes/home";
import Start from "routes/start";

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Start} />
      </Router>
    </div>
  );
};

export default App;
