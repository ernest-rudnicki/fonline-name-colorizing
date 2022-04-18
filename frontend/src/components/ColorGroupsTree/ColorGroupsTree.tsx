import { FunctionalComponent, h } from "preact";
import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment,
} from "react-complex-tree";

import { TreeItemProps } from "generic/generic";
import { isColorGroup, TreeItemData } from "store/file/helpers";
import { ColorTreeItems } from "store/file/types";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";

import "./style.scss";

export interface ColorGroupsTreeProps {
  colors: ColorTreeItems;
  treeId: string;
}

const ColorGroupsTree: FunctionalComponent<ColorGroupsTreeProps> = (props) => {
  const { colors, treeId } = props;

  return (
    <UncontrolledTreeEnvironment
      dataProvider={
        new StaticTreeDataProvider(colors, (item, data) => {
          return {
            ...item,
            data,
          };
        })
      }
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
              <div>{props.item.data.name}</div>
            </div>
          ) as React.ReactElement;
        }
        return (
          <span className="tree-username">{props.item.data}</span>
        ) as React.ReactElement;
      }}
      viewState={{}}
    >
      <Tree treeId={treeId} rootItem="root" treeLabel="Color groups" />
    </UncontrolledTreeEnvironment>
  );
};

export default ColorGroupsTree;
