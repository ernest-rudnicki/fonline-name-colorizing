import { FunctionalComponent, h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { Link } from "preact-router";
import { AiFillPlusCircle } from "react-icons/ai";
import { useCallback } from "preact/hooks";
import { TreeItemIndex } from "react-complex-tree";

import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import ColorGroupsTree from "components/ColorGroupsTree/ColorGroupsTree";
import { changeSelectedColor } from "store/file/slice";
import { isColorGroup } from "store/file/helpers";

import "./style.scss";
import "react-complex-tree/lib/style.css";

const Editor: FunctionalComponent = () => {
  const { treeItems } = useSelector((state: RootState) => state.file);
  const dispatch: AppDispatch = useDispatch();

  const onSelectItem = useCallback(
    (itemIndex: TreeItemIndex) => {
      const item = treeItems[itemIndex];

      if (item.data.rootParent) {
        dispatch(changeSelectedColor(item.data.rootParent));
      }

      if (isColorGroup(item.data)) {
        dispatch(changeSelectedColor(item));
      }
    },
    [treeItems, dispatch]
  );

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
          <ColorGroupsTree
            onSelectItem={onSelectItem}
            treeId="color-groups"
            treeItems={treeItems}
          />
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
