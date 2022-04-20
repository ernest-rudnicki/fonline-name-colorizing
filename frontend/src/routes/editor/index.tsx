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
import ColorList from "components/ColorList/ColorList";

const Editor: FunctionalComponent = () => {
  const { colors } = useSelector((state: RootState) => state.file);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="editor">
      <div className="editor-list">
        <TitleBar title="Color Groups">
          <Button
            variant="minimal"
            size="small"
            mode="dark"
            tooltipText="Add new color group"
            icon={<AiFillPlusCircle />}
          />
        </TitleBar>
        <div className="editor-list-content">
          <ColorList colors={colors} />
        </div>
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
