import { FunctionalComponent, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Link } from "preact-router";
import { AiFillFolderOpen, AiFillEdit } from "react-icons/ai";

import { checkIfFileExist } from "utils";
import { CURRENT_DIR, NAME_COLORIZING_FILE_NAME } from "constants/constants";
import Button from "components/Button/Button";
import { neutralino } from "neutralino/neutralino";

import "./style.scss";

const Start: FunctionalComponent = () => {
  const [isFileInCurrentDir, setIsFileInCurrentDir] = useState<boolean>(false);

  // TODO serve error case
  useEffect(() => {
    checkIfFileExist(CURRENT_DIR, NAME_COLORIZING_FILE_NAME).then((value) =>
      setIsFileInCurrentDir(value)
    );
  }, []);

  const openFileDialog = useCallback(() => {
    neutralino.os.showOpenDialog("Open your name colorizing file", {
      filters: [
        {
          name: "Text files",
          extensions: ["txt"],
        },
      ],
    });
  }, []);

  return (
    <div className="start">
      <div className="start-container">
        <img
          className="start-container-img"
          alt="Fallout boy"
          src="assets/img/fallout_boy.png"
        />
        <div className="start-container-content">
          <h1>Fonline Name Colorizing</h1>
          {isFileInCurrentDir ? (
            <span>
              We found a <b>NameColorizing</b> file in the current directory!{" "}
              <Link href="/editor">Click here to open it</Link>
            </span>
          ) : null}
          <div className="start-container-content-btns">
            <Button
              icon={<AiFillEdit />}
              className="start-container-content-btns-btn"
            >
              Create New Name Colorizing
            </Button>
            <Button
              onClick={openFileDialog}
              icon={<AiFillFolderOpen />}
              variant="bordered"
              className="start-container-content-btns-btn"
            >
              Open existing file
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
