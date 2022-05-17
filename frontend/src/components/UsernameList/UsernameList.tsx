import { Form, Input, Select } from "antd";
import { Entries } from "generic/generic";
import { FunctionalComponent, h } from "preact";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { useCallback, useEffect, useState } from "preact/hooks";
import cloneDeep from "lodash.clonedeep";
import { v4 as uuidv4 } from "uuid";

import {
  debounce,
  getEntries,
  joinClassNames,
  overrideReactType,
} from "utils/utils";
import {
  ColorGroupHashMap,
  RGBColor,
  Username,
  UsernameFormItemError,
  UsernameState,
} from "store/file/types";
import Button from "components/Button/Button";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import { isTestingEnv } from "utils/testing-utils";

import "./style.scss";

export interface UsernameListProps {
  value?: Username[];
  className?: string;
  colors: ColorGroupHashMap;
  selectedColorKey: string;
  allUsernames: Username[];
  onChange?: (value: Username[]) => void;
}

const UsernameList: FunctionalComponent<UsernameListProps> = (props) => {
  const { value, className, colors, selectedColorKey, allUsernames, onChange } =
    props;
  const [internalValue, setInternalValue] = useState<Username[]>([]);
  const colorEntries = getEntries(colors);

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
        if (isTestingEnv()) {
          console.log("triggers if route when onChange is not passed");
        }
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
      id: string,
      objectKey: Exclude<keyof Username, "state">,
      values: Username[]
    ): [Username[], number] => {
      const valuesCopy = cloneDeep(values);
      const foundIndex = valuesCopy.findIndex((el) => el.id === id);

      if (foundIndex === -1) {
        return [valuesCopy, -1];
      }

      valuesCopy[foundIndex][objectKey] = updateValue;

      return [valuesCopy, foundIndex];
    },
    []
  );

  const updateItemErrors = useCallback(
    (item: Username, errors: Partial<UsernameFormItemError>): Username => {
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
    (item: Username, errorKey: keyof Username): Username => {
      if (!item.errors) {
        if (isTestingEnv()) {
          console.log("triggers if route when the are no errors on the item");
        }
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

  const onInputChange = debounce((value: string, id: string) => {
    const [updated, foundIndex] = updateUsername(
      value,
      id,
      "name",
      internalValue
    );

    if (foundIndex === -1) {
      return;
    }

    const { name } = updated[foundIndex];
    const duplicatedUsername = validateUsername(id, name);

    if (duplicatedUsername) {
      const { nameColorId, contourColorId } = duplicatedUsername;
      const nameColor = colors[nameColorId].name;
      const contourColor = colors[contourColorId].name;

      updated[foundIndex] = updateItemErrors(updated[foundIndex], {
        name: `Username assigned to:\n${nameColor} and ${contourColor}`,
      });
    } else {
      updated[foundIndex] = removeItemError(updated[foundIndex], "name");
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
      return colorEntries.map(([colorKey, value]) => (
        <Select.Option key={colorKey} value={colorKey}>
          {renderOptionContent(value.color, value.name)}
        </Select.Option>
      )) as React.ReactNode;
    },
    [renderOptionContent]
  );

  const onSelectChange = useCallback(
    (value: string, id: string, colorKey: "nameColorId" | "contourColorId") => {
      const [updated, foundIndex] = updateUsername(
        value,
        id,
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
    (id: string) => {
      const index = internalValue.findIndex((el) => el.id === id);
      const newInternalValue = cloneDeep(internalValue);
      const username = newInternalValue[index];
      if (index === -1) {
        return;
      }

      if (username.state === UsernameState.UNSAVED) {
        newInternalValue.splice(index, 1);
        _onChange(newInternalValue);
        return;
      }

      newInternalValue[index].state = UsernameState.DELETED;
      _onChange(newInternalValue);
    },
    [internalValue, _onChange]
  );

  const addUsername = useCallback(() => {
    const internalValueCopy = [...internalValue];
    internalValueCopy.push({
      id: uuidv4(),
      name: "",
      nameColorId: selectedColorKey,
      contourColorId: selectedColorKey,
      state: UsernameState.UNSAVED,
    });

    _onChange(internalValueCopy);
  }, [internalValue, selectedColorKey, _onChange]);

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
      {internalValue.map(
        (el) =>
          el.state !== UsernameState.DELETED && (
            <div className="username-list-row username-list-data" key={el.id}>
              <div className="username-list-row-item username-list-row-title">
                <span className="username-list-row-title-buttons">
                  <Button
                    tooltipText="Delete username from both colors"
                    color="danger"
                    size="between"
                    className="username-list-row-title-buttons-btn"
                    variant="rounded-square"
                    onClick={() => deleteUsername(el.id)}
                    icon={<AiFillDelete />}
                  />
                </span>
                <Form.Item
                  validateStatus={el.errors ? "error" : undefined}
                  help={el.errors?.name}
                >
                  {overrideReactType(
                    <Input
                      aria-label="Username"
                      value={el.name}
                      onChange={(value) =>
                        onInputChange(value.currentTarget.value, el.id)
                      }
                    />
                  )}
                </Form.Item>
              </div>
              <div className="username-list-row-item username-list-row-color">
                <Select
                  onChange={(value) =>
                    onSelectChange(value, el.id, "nameColorId")
                  }
                  value={el.nameColorId}
                >
                  {renderSelectOptions(colorEntries)}
                </Select>
              </div>
              <div className="username-list-row-item username-list-row-contour">
                <Select
                  onChange={(value) =>
                    onSelectChange(value, el.id, "contourColorId")
                  }
                  value={el.contourColorId}
                >
                  {renderSelectOptions(colorEntries)}
                </Select>
              </div>
            </div>
          )
      )}
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
