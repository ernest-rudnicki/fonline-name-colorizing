import { Select } from "antd";
import { Entries } from "generic/generic";
import { FunctionalComponent, h } from "preact";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

import { joinClassNames } from "utils/utils";
import { ColorGroupHashMap, RGBColor, Username } from "store/file/types";
import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";

import "./style.scss";
import { useCallback } from "preact/hooks";
export interface UsernameListProps {
  value?: Username[];
  className?: string;
  colors: Entries<ColorGroupHashMap>;
  onChange?: (value: Username[]) => void;
}

const UsernameList: FunctionalComponent<UsernameListProps> = (props) => {
  const { value, className, colors, onChange } = props;

  const renderOptionContent = useCallback((color: RGBColor, key: string) => {
    return (
      <div className="username-list-row-item-option">
        <ColoredSquare
          className="username-list-row-item-option-square"
          color={color}
          size={16}
        />
        {key}
      </div>
    ) as React.ReactNode;
  }, []);

  const renderSelectOptions = useCallback(
    (colorEntries: Entries<ColorGroupHashMap>) => {
      return colorEntries.map(([key, value]) => (
        <Select.Option key={key} value={key}>
          {renderOptionContent(value.color, key)}
        </Select.Option>
      )) as React.ReactNode;
    },
    [renderOptionContent]
  );

  return (
    <div className={joinClassNames(["username-list", className])}>
      <div className="username-list-row">
        <div className="username-list-row-item username-list-row-header username-list-row-title">
          <div className="username-list-row-header-actions">Actions</div>
          Usernames
        </div>
        <div className="username-list-row-item username-list-row-header username-list-row-color">
          Name color
        </div>
        <div className="username-list-row-item username-list-row-header username-list-row-color">
          Contour color
        </div>
      </div>
      {value &&
        value.map((el) => (
          <div className="username-list-row username-list-data" key={el.name}>
            <div className="username-list-row-item username-list-row-title">
              <span className="username-list-row-title-buttons">
                <Button
                  tooltipText="Edit"
                  size="between"
                  className="username-list-row-title-buttons-btn"
                  variant="rounded-square"
                  icon={<AiFillEdit />}
                />
                <Button
                  tooltipText="Delete"
                  color="danger"
                  size="between"
                  className="username-list-row-title-buttons-btn"
                  variant="rounded-square"
                  icon={<AiFillDelete />}
                />
              </span>
              <span className="username-list-row-title-text">{el.name}</span>
            </div>
            <Select
              className="username-list-row-item username-list-row-color"
              value={el.nameColor}
            >
              {renderSelectOptions(colors)}
            </Select>
            <Select
              className="username-list-row-item username-list-row-contour"
              value={el.contourColor}
            >
              {renderSelectOptions(colors)}
            </Select>
          </div>
        ))}
    </div>
  );
};

export default UsernameList;
