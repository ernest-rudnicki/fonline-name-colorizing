import { FunctionalComponent, h } from "preact";

import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import { ColorGroupHashMap } from "store/file/types";
import { getEntries, joinClassNames } from "utils/utils";
import { isTestingEnv } from "utils/testing-utils";

import "./style.scss";

export interface ColoredSquareProps {
  unsavedColors: ColorGroupHashMap;
  colors: ColorGroupHashMap;
  selectedKey?: string | null;
  className?: string;
  onClick?: (colorKey: string) => void;
}

const ColorList: FunctionalComponent<ColoredSquareProps> = (props) => {
  const { colors, unsavedColors, selectedKey, className, onClick } = props;
  const entries = getEntries(colors);

  const _onClick = (key: string) => {
    if (!onClick) {
      if (isTestingEnv()) {
        console.log("triggers if route when no handler is provided");
      }
      return;
    }
    onClick(key);
  };

  return (
    <div className={joinClassNames(["color-list", className])}>
      {entries.map(([key, value]) => (
        <Button
          key={key}
          className={joinClassNames([
            "color-list-item",
            selectedKey === key ? "selected" : null,
          ])}
          onClick={() => _onClick(key)}
          variant="text"
          size="tiny"
        >
          <div className="color-list-item-content">
            <ColoredSquare
              className="color-list-item-content-square"
              size={16}
              color={value.color}
            />
            {unsavedColors[key] ? (
              <i>
                {value.name} ({value.usernames.length})*
              </i>
            ) : (
              <span>
                {value.name} ({value.usernames.length})
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ColorList;
