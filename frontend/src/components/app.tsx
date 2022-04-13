import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useEffect } from "preact/hooks";
import { neutralino } from "neutralino/neutralino";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

import Home from "routes/home";
import NotFoundPage from "routes/notfound";

const App: FunctionalComponent = () => {
  const getDirectory = async () => {
    const entries = await neutralino.filesystem.readDirectory("./");
    console.log(entries);
  };

  const { test } = useSelector((state: RootState) => state.file);

  useEffect(() => {
    getDirectory();
    console.log(test);
  }, [test]);

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
