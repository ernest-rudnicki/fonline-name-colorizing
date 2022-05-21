import { FunctionalComponent, h } from "preact";

import { RGBColor } from "store/file/types";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface ColoredSquareProps {
  size: number;
  color: RGBColor;
  className?: string;
}

const ColoredSquare: FunctionalComponent<ColoredSquareProps> = (props) => {
  const { size, color, className } = props;
  const { r, g, b } = color;

  return (
    <div
      className={joinClassNames(["colored-square", className])}
      style={{
        width: size,
        height: size,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
      }}
    />
  );
};

export default ColoredSquare;
