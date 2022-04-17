import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import { AiFillPlusCircle } from "react-icons/ai";

import "./style.scss";

const Editor: FunctionalComponent = () => {
  return (
    <div className="editor">
      <div className="editor-list">
        <TitleBar title="Color Groups">
          <Button
            variant="minimal"
            size="tiny"
            mode="dark"
            tooltipText="Add new color group"
            icon={<AiFillPlusCircle />}
          />
        </TitleBar>
        <div className="editor-list-content">list</div>
      </div>
      <div className="editor-config">
        <div className="editor-config-content">
          <Link href="/">Go back</Link>
        </div>
      </div>
    </div>
  );
};

export default Editor;
