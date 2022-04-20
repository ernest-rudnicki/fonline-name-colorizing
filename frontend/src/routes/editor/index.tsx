import { FunctionalComponent, h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { Link } from "preact-router";
import { AiFillPlusCircle } from "react-icons/ai";
import { useCallback } from "preact/hooks";

import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";

import "./style.scss";
import "react-complex-tree/lib/style.css";

const Editor: FunctionalComponent = () => {
  const dispatch: AppDispatch = useDispatch();

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
        <div className="editor-list-content">test</div>
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
