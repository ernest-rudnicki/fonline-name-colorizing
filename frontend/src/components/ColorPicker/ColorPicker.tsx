import { FunctionalComponent, h } from "preact";
import { RgbColorPicker } from "react-colorful";

import { RGBColor } from "store/file/types";
import { debounce, joinClassNames } from "utils/utils";

import "./style.scss";

export interface ColorPickerProps {
  value?: RGBColor;
  className?: string;
  onChange?: (value: RGBColor) => void;
}

const ColorPicker: FunctionalComponent<ColorPickerProps> = (props) => {
  const { value, className, onChange } = props;

  /* istanbul ignore next */
  const _onChange = debounce((color: RGBColor) => {
    if (!onChange) {
      return;
    }
    onChange(color);
  }, 300);

  return (
    <div className={joinClassNames(["color-picker", className])}>
      <RgbColorPicker color={value} onChange={_onChange} />
    </div>
  );
};

export default ColorPicker;
