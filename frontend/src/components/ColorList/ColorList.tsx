import { FunctionalComponent, h } from "preact";

import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import { ColorGroup, ColorGroupHashMap } from "store/file/types";
import { getEntries, joinClassNames } from "utils/utils";

import "./style.scss";

export interface ColoredSquareProps {
  colors: ColorGroupHashMap;
  selectedKey?: string;
  className?: string;
  onClick?: (color: ColorGroup) => void;
}

const TitleBar: FunctionalComponent<ColoredSquareProps> = (props) => {
  const { colors, selectedKey, className, onClick } = props;
  const entries = getEntries(colors);

  const _onClick = (key: string) => {
    if (!onClick) {
      return;
    }
    onClick(colors[key]);
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
              size={20}
              color={value.color}
            />
            <b>{key}</b>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default TitleBar;
