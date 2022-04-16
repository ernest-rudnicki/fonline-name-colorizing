import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import "./style.scss";

const Editor: FunctionalComponent = () => {
  return (
    <div class="editor">
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <Link href="/">Go back</Link>
    </div>
  );
};

export default Editor;
