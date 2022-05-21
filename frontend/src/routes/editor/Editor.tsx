import { FunctionalComponent, h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { AiFillPlusCircle, AiOutlineExport } from "react-icons/ai";
import { useCallback } from "preact/hooks";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { notification } from "antd";

import Button from "components/Button/Button";
import TitleBar from "components/TitleBar/TitleBar";
import ColorList from "components/ColorList/ColorList";
import {
  changeSelectedColor,
  changeValidation,
  updateColors,
} from "store/file/slice";
import ColorDetails from "./ColorDetails/ColorDetails";
import { checkIfFileExist, getCurrentDate, getEntries } from "utils/utils";
import { CURRENT_DIR, NAME_COLORIZING_FILE_NAME } from "constants/constants";

import "./style.scss";
import { neutralino } from "neutralino/neutralino";
import { isTestingEnv } from "utils/testing-utils";

const Editor: FunctionalComponent = () => {
  const {
    colors,
    selectedColorKey,
    usernames,
    unsavedColors,
    triggeredValidation,
  } = useSelector((state: RootState) => state.file);
  const colorEntries = getEntries(colors);

  const dispatch: AppDispatch = useDispatch();

  const onColorListItemClick = useCallback(
    (colorKey: string) => {
      dispatch(changeSelectedColor(colorKey));
    },
    [dispatch]
  );

  const onCreateNewColor = useCallback(() => {
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

  const validateColors = useCallback(() => {
    const unsavedColorEntries = getEntries(unsavedColors);

    if (unsavedColorEntries.length !== 0) {
      notification.error({
        message: "There are some unsaved colors.",
        description: "Please save the colors or delete them.",
      });
      return true;
    }

    let isError = false;

    colorEntries.some(([key, color]) => {
      if (color.name === "") {
        isError = true;
        return true;
      }
    });

    if (isError) {
      notification.error({
        message: "There are some colors missing names.",
        description:
          "Please add a name to newly added color or remove it entirely.",
      });
    }

    return isError;
  }, [unsavedColors, colorEntries]);

  const onExport = useCallback(() => {
    if (validateColors()) {
      dispatch(changeValidation(true));
      return;
    }
    let lines: string[] = [];

    lines = colorEntries.map(([key, colorGroup]) => {
      return `@ ${colorGroup.name} ${colorGroup.color.r} ${colorGroup.color.g} ${colorGroup.color.b}\n`;
    });

    lines.push(`\n`);

    usernames.forEach((username) => {
      lines.push(
        `> ${username.name} ${colors[username.nameColorId].name} ${
          colors[username.contourColorId].name
        }\n`
      );
    });

    checkIfFileExist(CURRENT_DIR, NAME_COLORIZING_FILE_NAME).then((value) => {
      const name = value
        ? `NameColorizing-${getCurrentDate()}.txt`
        : NAME_COLORIZING_FILE_NAME;

      neutralino.filesystem
        .writeFile(CURRENT_DIR + name, lines.join(""))
        .then(() => {
          notification.success({ message: "The file exported successfully" });
        })
        .catch((e) => {
          notification.error({
            message: "The error occured during the file export",
          });

          if (isTestingEnv()) {
            console.log("triggers notification if there is an error");
          }
        });
    });
  }, [colors, colorEntries, usernames, validateColors, dispatch]);

  return (
    <div className="editor">
      <div className="editor-list">
        <TitleBar title="Color Groups">
          <Button
            onClick={onCreateNewColor}
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
            triggeredValidation={triggeredValidation}
            unsavedColors={unsavedColors}
            selectedKey={selectedColorKey}
            onClick={onColorListItemClick}
            colors={colors}
          />
        </div>
        <div className="editor-list-actions">
          <Button
            disabled={colorEntries.length === 0}
            onClick={onExport}
            icon={<AiOutlineExport />}
          >
            Export to file
          </Button>
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
