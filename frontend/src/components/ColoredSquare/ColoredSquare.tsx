import { FunctionalComponent, h } from "preact";

import { RGBColor } from "store/file/types";

import "./style.scss";

export interface ColoredSquareProps {
  size: number;
  color: RGBColor;
  className?: string;
}

const ColoredSquare: FunctionalComponent<ColoredSquareProps> = (props) => {
  const { size, color, className } = props;
  const { red, green, blue } = color;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: `rgb(${red}, ${green}, ${blue})`,
      }}
    />
  );
};

export default ColoredSquare;
