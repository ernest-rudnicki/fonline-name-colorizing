import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useEffect } from "preact/hooks";
import { neutralino } from "@neutralino/neutralino";

import Home from "@routes/home";
import NotFoundPage from "@routes/notfound";

const App: FunctionalComponent = () => {
  const getDirectory = async () => {
    const entries = await neutralino.filesystem.readDirectory("./");
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
