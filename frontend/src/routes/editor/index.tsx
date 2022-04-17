import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from "react-complex-tree";

import "./style.scss";
import "react-complex-tree/lib/style.css";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const Editor: FunctionalComponent = () => {
  const { colors } = useSelector((state: RootState) => state.file);
  console.log(colors);
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
          <UncontrolledTreeEnvironment
            dataProvider={
              new StaticTreeDataProvider(colors, (item, data) => {
                console.log(item);
                return {
                  ...item,
                  data,
                };
              })
            }
            getItemTitle={(item) => item.data}
            viewState={{}}
          >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
          </UncontrolledTreeEnvironment>
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
