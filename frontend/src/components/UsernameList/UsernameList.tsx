import { Form, Input, Select } from "antd";
import { Entries } from "generic/generic";
import { FunctionalComponent, h } from "preact";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { useCallback, useEffect, useState } from "preact/hooks";
import cloneDeep from "lodash.clonedeep";
import { v4 as uuidv4 } from "uuid";

import { debounce, joinClassNames } from "utils/utils";
import {
  ColorGroupHashMap,
  RGBColor,
  Username,
  UsernameFormItem,
  UsernameFormItemError,
} from "store/file/types";
import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";

import "./style.scss";

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
    (newValue: UsernameFormItem[]) => {
      setInternalValue(newValue);

      if (!onChange) {
        return;
      }

      onChange(newValue);
    },
    [onChange]
  );

  const validateUsername = useCallback(
    (id: string, username: string): Username | null => {
      const filtered = allUsernames.filter(
        (el) => el.name === username && el.id !== id
      );
      return filtered.length !== 0 ? filtered[0] : null;
    },
    [allUsernames]
  );

  const updateUsername = useCallback(
    (
      updateValue: string,
      username: string,
      objectKey: keyof Username,
      values: UsernameFormItem[]
    ): [UsernameFormItem[], number] => {
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

  const updateItemErrors = useCallback(
    (
      item: UsernameFormItem,
      errors: Partial<UsernameFormItemError>
    ): UsernameFormItem => {
      if (item.errors) {
        return {
          ...item,
          errors: {
            ...item.errors,
            ...errors,
          },
        };
      }

      item.errors = errors;
      return item;
    },
    []
  );

  const removeItemError = useCallback(
    (
      item: UsernameFormItem,
      errorKey: keyof UsernameFormItemError
    ): UsernameFormItem => {
      if (!item.errors) {
        return item;
      }

      delete item.errors[errorKey];
      if (Object.keys(item.errors)) {
        delete item.errors;
      }

      return item;
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
    const { id, name } = updated[foundIndex];
    const duplicatedUsername = validateUsername(id, name);
    if (duplicatedUsername) {
      updated[foundIndex] = updateItemErrors(updated[foundIndex], {
        name: `Username assigned to:\n${duplicatedUsername.nameColor} and ${duplicatedUsername.contourColor}`,
      });
    } else {
      updated[foundIndex] = removeItemError(updated[foundIndex], "name");
    }

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
      id: uuidv4(),
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
        <div className="username-list-row username-list-data" key={el.id}>
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
            <Form.Item
              validateStatus={el.errors ? "error" : undefined}
              help={el.errors?.name}
            >
              {renderInput(el)}
            </Form.Item>
          </div>
          <div className="username-list-row-item username-list-row-color">
            <Select
              onChange={(value) => onSelectChange(value, el.name, "nameColor")}
              value={el.nameColor}
            >
              {renderSelectOptions(colors)}
            </Select>
          </div>
          <div className="username-list-row-item username-list-row-contour">
            <Select
              onChange={(value) =>
                onSelectChange(value, el.name, "contourColor")
              }
              value={el.contourColor}
            >
              {renderSelectOptions(colors)}
            </Select>
          </div>
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
