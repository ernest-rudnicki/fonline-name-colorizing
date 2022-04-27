import { Form, Input, Select } from "antd";
import { Entries } from "generic/generic";
import { FunctionalComponent, h, Fragment } from "preact";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { useCallback, useEffect, useState } from "preact/hooks";

import { debounce, joinClassNames } from "utils/utils";
import {
  ColorGroupHashMap,
  RGBColor,
  Username,
  UsernameFormItem,
} from "store/file/types";
import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";

import "./style.scss";
import cloneDeep from "lodash.clonedeep";

export interface UsernameListProps {
  value?: Username[];
  className?: string;
  colors: Entries<ColorGroupHashMap>;
  selectedColorKey: string;
  allUsernames: Username[];
  onChange?: (value: UsernameFormItem[]) => void;
}

const UsernameList: FunctionalComponent<UsernameListProps> = (props) => {
  const { value, className, colors, selectedColorKey, allUsernames, onChange } =
    props;
  const [internalValue, setInternalValue] = useState<UsernameFormItem[]>([]);

  useEffect(() => {
    if (!value) {
      return;
    }

    setInternalValue(value);
  }, [value]);

  const _onChange = useCallback(
    (newValue: Username[]) => {
      setInternalValue(newValue);

      if (!onChange) {
        return;
      }

      onChange(newValue);
    },
    [onChange]
  );

  const validateUsername = useCallback(
    (username: string): boolean => {
      const filtered = allUsernames.filter(
        (el) =>
          el.name === username &&
          el.nameColor !== selectedColorKey &&
          el.contourColor !== selectedColorKey
      );
      return filtered.length === 0;
    },
    [allUsernames, selectedColorKey]
  );

  const updateUsername = useCallback(
    (
      updateValue: string,
      username: string,
      objectKey: keyof Username,
      values: Username[]
    ): [Username[], number] => {
      const valuesCopy = cloneDeep(values);
      const foundIndex = valuesCopy.findIndex((el) => el.name === username);

      if (foundIndex === -1) {
        return [valuesCopy, -1];
      }

      valuesCopy[foundIndex][objectKey] = updateValue;

      return [valuesCopy, foundIndex];
    },
    []
  );

  const onInputChange = debounce((value: string, username: string) => {
    const [updated, foundIndex] = updateUsername(
      value,
      username,
      "name",
      internalValue
    );

    if (foundIndex === -1) {
      return;
    }

    _onChange(updated);
  }, 300);

  const renderOptionContent = useCallback(
    (color: RGBColor, username: string) => {
      return (
        <div className="username-list-row-item-option">
          <ColoredSquare
            className="username-list-row-item-option-square"
            color={color}
            size={16}
          />
          {username}
        </div>
      ) as React.ReactNode;
    },
    []
  );

  const renderSelectOptions = useCallback(
    (colorEntries: Entries<ColorGroupHashMap>) => {
      return colorEntries.map(([username, value]) => (
        <Select.Option key={username} value={username}>
          {renderOptionContent(value.color, username)}
        </Select.Option>
      )) as React.ReactNode;
    },
    [renderOptionContent]
  );

  const onSelectChange = useCallback(
    (
      value: string,
      username: string,
      colorKey: "nameColor" | "contourColor"
    ) => {
      const [updated, foundIndex] = updateUsername(
        value,
        username,
        colorKey,
        internalValue
      );

      if (foundIndex === -1) {
        return;
      }

      _onChange(updated);
    },
    [internalValue, _onChange, updateUsername]
  );

  const deleteUsername = useCallback(
    (username: string) => {
      const filtered = internalValue.filter((el) => el.name !== username);
      _onChange(filtered);
    },
    [internalValue, _onChange]
  );

  const addUsername = useCallback(() => {
    const internalValueCopy = [...internalValue];
    internalValueCopy.push({
      name: "",
      nameColor: selectedColorKey,
      contourColor: selectedColorKey,
    });

    _onChange(internalValueCopy);
  }, [internalValue, selectedColorKey, _onChange]);

  const renderInput = (el: Username) => {
    return (
      <Input
        value={el.name}
        onChange={(value) => onInputChange(value.currentTarget.value, el.name)}
      />
    ) as React.ReactNode;
  };

  return (
    <div className={joinClassNames(["username-list", className])}>
      <div className="username-list-row">
        <div className="username-list-row-item username-list-row-header username-list-row-title">
          Usernames
        </div>
        <div className="username-list-row-item username-list-row-header username-list-row-color">
          Name color
        </div>
        <div className="username-list-row-item username-list-row-header username-list-row-color">
          Contour color
        </div>
      </div>
      {internalValue.map((el) => (
        <div className="username-list-row username-list-data" key={el.name}>
          <div className="username-list-row-item username-list-row-title">
            <span className="username-list-row-title-buttons">
              <Button
                tooltipText="Delete username"
                color="danger"
                size="between"
                className="username-list-row-title-buttons-btn"
                variant="rounded-square"
                onClick={() => deleteUsername(el.name)}
                icon={<AiFillDelete />}
              />
            </span>
            <Form.Item>{renderInput(el)}</Form.Item>
          </div>
          <Select
            onChange={(value) => onSelectChange(value, el.name, "nameColor")}
            className="username-list-row-item username-list-row-color"
            value={el.nameColor}
          >
            {renderSelectOptions(colors)}
          </Select>
          <Select
            onChange={(value) => onSelectChange(value, el.name, "contourColor")}
            className="username-list-row-item username-list-row-contour"
            value={el.contourColor}
          >
            {renderSelectOptions(colors)}
          </Select>
        </div>
      ))}
      <div className="username-list-row">
        <Button
          size="between"
          className="username-list-row-title-buttons-btn"
          variant="rounded-square"
          onClick={addUsername}
          icon={<AiFillPlusCircle />}
        >
          Add new username
        </Button>
      </div>
    </div>
  );
};

export default UsernameList;
