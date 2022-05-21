import { FunctionalComponent, h } from "preact";

import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import { ColorGroup, ColorGroupHashMap } from "store/file/types";
import { getEntries, joinClassNames } from "utils/utils";
import { isTestingEnv } from "utils/testing-utils";

import "./style.scss";

export interface ColoredSquareProps {
  unsavedColors: ColorGroupHashMap;
  colors: ColorGroupHashMap;
  selectedKey?: string | null;
  className?: string;
  triggeredValidation: boolean;
  onClick?: (colorKey: string) => void;
}

const ColorList: FunctionalComponent<ColoredSquareProps> = (props) => {
  const {
    colors,
    unsavedColors,
    selectedKey,
    className,
    triggeredValidation,
    onClick,
  } = props;
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

  const renderListItemContent = (key: string, value: ColorGroup) => {
    if (value.name === "") {
      return (
        <i className={triggeredValidation ? "color-list-item-error" : ""}>
          New Color ({value.usernames.length})*
        </i>
      );
    }

    if (unsavedColors[key]) {
      return (
        <i className={triggeredValidation ? "color-list-item-error" : ""}>
          {value.name} ({value.usernames.length})*
        </i>
      );
    }

    return (
      <span>
        {value.name} ({value.usernames.length})
      </span>
    );
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
            {renderListItemContent(key, value)}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ColorList;
