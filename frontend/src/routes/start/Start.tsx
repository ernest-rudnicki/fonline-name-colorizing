import { FunctionalComponent, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { AiFillFolderOpen, AiFillEdit } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import { AppDispatch } from "store/store";
import { v4 as uuidv4 } from "uuid";

import { checkIfFileExist } from "utils/utils";
import {
  CURRENT_DIR,
  NAME_COLORIZING_FILE_FILTERS,
  NAME_COLORIZING_FILE_NAME,
} from "constants/constants";
import Button from "components/Button/Button";
import { neutralino } from "neutralino/neutralino";
import { readFileContent } from "store/file/actions";
import { isTestingEnv } from "utils/testing-utils";
import { updateColors } from "store/file/slice";

import "./style.scss";

const Start: FunctionalComponent = () => {
  const [isFileInCurrentDir, setIsFileInCurrentDir] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    checkIfFileExist(CURRENT_DIR, NAME_COLORIZING_FILE_NAME).then((value) =>
      setIsFileInCurrentDir(value)
    );
  }, []);

  const openFileDialog = useCallback(() => {
    neutralino.os
      .showOpenDialog("Open your name colorizing file", {
        filters: NAME_COLORIZING_FILE_FILTERS,
      })
      .then((res) => {
        if (res.length === 0) {
          if (isTestingEnv()) {
            console.log("goes if route when there is no file selected");
          }
          return;
        }

        dispatch(readFileContent(res[0])).then(() => {
          route("/editor");
        });
      });
  }, [dispatch]);

  const onFoundClick = useCallback(() => {
    const dir = CURRENT_DIR + NAME_COLORIZING_FILE_NAME;

    dispatch(readFileContent(dir))
      .unwrap()
      .then(() => {
        route("/editor");
      })
      .catch(() => {
        setIsFileInCurrentDir(false);
        notification.error({
          message: "No file found",
          description:
            "NameColorizing file is no longer available in the current directory",
        });
      });

    if (isTestingEnv()) {
      console.log("handles error when the file to import was deleted/moved");
    }
  }, [dispatch]);

  const createFromScratch = useCallback(() => {
    const id = uuidv4();
    dispatch(
      updateColors({
        [id]: {
          name: "New Color",
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
          usernames: [],
        },
      })
    );
    route("/editor");
  }, [dispatch]);

  return (
    <div className="start">
      <div className="start-container">
        <img
          className="start-container-img"
          alt="Fallout boy"
          src="assets/img/fallout_boy.png"
        />
        <div className="start-container-content">
          <h1 className="start-container-content-header">
            Fonline Name Colorizing
          </h1>
          {isFileInCurrentDir ? (
            <div className="start-container-content-found">
              <span>
                We found a <b>NameColorizing</b> file in the current directory!{" "}
                <Button
                  className="start-container-content-found-btn"
                  onClick={onFoundClick}
                  variant="minimal"
                  size="small"
                >
                  Click here to import it
                </Button>
              </span>
            </div>
          ) : null}
          <div className="start-container-content-btns">
            <Button
              onClick={createFromScratch}
              icon={<AiFillEdit />}
              className="start-container-content-btns-btn"
            >
              Create new Name Colorizing
            </Button>
            <Button
              onClick={openFileDialog}
              icon={<AiFillFolderOpen />}
              variant="bordered"
              className="start-container-content-btns-btn"
            >
              Import existing file
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
