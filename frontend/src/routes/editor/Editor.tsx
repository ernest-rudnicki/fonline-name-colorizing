import { FunctionalComponent, h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { AiFillPlusCircle } from "react-icons/ai";
import { useCallback } from "preact/hooks";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import ColorList from "components/ColorList/ColorList";
import { changeSelectedColor, updateColors } from "store/file/slice";
import ColorDetails from "./ColorDetails/ColorDetails";

import "./style.scss";

const Editor: FunctionalComponent = () => {
  const { colors, selectedColorKey, usernames, unsavedColors } = useSelector(
    (state: RootState) => state.file
  );

  const dispatch: AppDispatch = useDispatch();

  const onColorListItemClick = useCallback(
    (colorKey: string) => {
      dispatch(changeSelectedColor(colorKey));
    },
    [dispatch]
  );

  const createNewColor = useCallback(() => {
    const colorsCopy = cloneDeep(colors);
    const id = uuidv4();
    colorsCopy[id] = {
      name: "",
      color: {
        r: 0,
        b: 0,
        g: 0,
      },
      usernames: [],
    };

    dispatch(updateColors(colorsCopy));
    dispatch(changeSelectedColor(id));
  }, [dispatch, colors]);

  return (
    <div className="editor">
      <div className="editor-list">
        <TitleBar title="Color Groups">
          <Button
            onClick={createNewColor}
            dataTestId="add-btn"
            variant="minimal"
            size="small"
            mode="dark"
            tooltipText="Add new color group"
            icon={<AiFillPlusCircle />}
          />
        </TitleBar>
        <div className="editor-list-content">
          <ColorList
            unsavedColors={unsavedColors}
            selectedKey={selectedColorKey}
            onClick={onColorListItemClick}
            colors={colors}
          />
        </div>
      </div>
      <div className="editor-config">
        {selectedColorKey && (
          <ColorDetails
            unsavedColors={unsavedColors}
            allUsernames={usernames}
            colors={colors}
            selectedColorKey={selectedColorKey}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
