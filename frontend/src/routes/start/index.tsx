import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { checkIfFileExist } from "utils";
import { currentDir } from "constants/constants";
import Button from "components/Button/Button";
import { Link } from "preact-router";

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
              We found a <b>NameColorizing</b> file in the current directory!{" "}
              <Link href="/editor">Click here to open it</Link>
            </span>
          ) : null}
          <div className="start-container-content-btns">
            <Button className="start-container-content-btns-btn">
              Create New Name Colorizing
            </Button>
            <Button
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
