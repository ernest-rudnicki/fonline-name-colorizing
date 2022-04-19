import { FunctionalComponent, h } from "preact";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { Link } from "preact-router";
import { AiFillPlusCircle } from "react-icons/ai";

import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import ColorGroupsTree from "components/ColorGroupsTree/ColorGroupsTree";

import "./style.scss";
import "react-complex-tree/lib/style.css";

const Editor: FunctionalComponent = () => {
  const { colors } = useSelector((state: RootState) => state.file);
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
        <div className="editor-list-content">
          <ColorGroupsTree treeId="color-groups" colors={colors} />
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
