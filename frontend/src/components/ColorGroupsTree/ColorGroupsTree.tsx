import { FunctionalComponent, h } from "preact";
import {
  StaticTreeDataProvider,
  Tree,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from "react-complex-tree";

import { TreeItemProps } from "generic/generic";
import { isColorGroup } from "store/file/helpers";
import { ColorTreeItems, TreeItemData } from "store/file/types";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";

import "./style.scss";
import { useCallback } from "preact/hooks";

export interface ColorGroupsTreeProps {
  treeItems: ColorTreeItems;
  treeId: string;
  onSelectItem?: (items: TreeItemIndex, treeId: string) => void;
}

const ColorGroupsTree: FunctionalComponent<ColorGroupsTreeProps> = (props) => {
  const { treeItems, treeId, onSelectItem } = props;

  const _onSelectItem = useCallback(
    (items: TreeItemIndex[], treeId: string) => {
      if (!onSelectItem) {
        return;
      }
      onSelectItem(items[0], treeId);
    },
    [onSelectItem]
  );

  return (
    <UncontrolledTreeEnvironment
      canSearch={false}
      dataProvider={new StaticTreeDataProvider(treeItems)}
      onSelectItems={_onSelectItem}
      getItemTitle={(item) => {
        if (isColorGroup(item.data)) {
          return item.data.name;
        }
        return item.data;
      }}
      renderItemTitle={(props: TreeItemProps<TreeItemData>) => {
        if (isColorGroup(props.item.data)) {
          const { color } = props.item.data;
          if (!color) {
            return null;
          }

          return (
            <div className="tree-color">
              <ColoredSquare
                className="tree-color-square"
                size={16}
                color={color}
              />
              <div>
                <b>{props.item.data.name}</b>
              </div>
            </div>
          ) as React.ReactElement;
        }
        return (
          <span className="tree-username">{props.item.data.name}</span>
        ) as React.ReactElement;
      }}
      viewState={{}}
    >
      <Tree treeId={treeId} rootItem="root" treeLabel="Color groups" />
    </UncontrolledTreeEnvironment>
  );
};

export default ColorGroupsTree;
