import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { checkIfFileExist } from "utils";
import { currentDir } from "constants/constants";
import Button from "components/Button/Button";

import "./style.scss";

const Start: FunctionalComponent = () => {
  const [isFileInCurrentDir, setIsFileInCurrentDir] = useState<boolean>(false);

  // TODO serve error case
  useEffect(() => {
    checkIfFileExist(currentDir, "NameColorizing.txt").then((value) =>
      setIsFileInCurrentDir(value)
    );
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
              We found a <b>NameColorizing</b> file in the current directory!
            </span>
          ) : null}
          <div className="start-container-content-btns">
            <Button className="start-container-content-btns-btn">
              Edit File in the Current Directory
            </Button>
            <Button
              variant="bordered"
              className="start-container-content-btns-btn"
            >
              Open Another File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
