import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "../routes/home";
import NotFoundPage from "../routes/notfound";
import { useEffect } from "preact/hooks";
import Neutralino from "../neutralino/neutralino";

const App: FunctionalComponent = () => {
  const getDirectory = async () => {
    const entries = await Neutralino.filesystem.readDirectory("./");
    console.log(entries);
  };

  useEffect(() => {
    getDirectory();
  }, []);

  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Home} />
        <NotFoundPage default />
      </Router>
    </div>
  );
};

export default App;
