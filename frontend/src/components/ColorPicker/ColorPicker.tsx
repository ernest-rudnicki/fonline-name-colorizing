import { FunctionalComponent, h } from "preact";
import { RgbColorPicker } from "react-colorful";

import { RGBColor } from "store/file/types";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface ColorPickerProps {
  value?: RGBColor;
  className?: string;
  onChange?: (value: RGBColor) => void;
}

const ColorPicker: FunctionalComponent<ColorPickerProps> = (props) => {
  const { value, className, onChange } = props;
  return (
    <div className={joinClassNames(["color-picker", className])}>
      <RgbColorPicker color={value} onChange={onChange} />
    </div>
  );
};

export default ColorPicker;
