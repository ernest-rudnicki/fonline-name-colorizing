import { FunctionalComponent, h, Fragment } from "preact";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Form, Input } from "antd";
import { useCallback, useEffect } from "preact/hooks";
import { cloneDeep, isEqual } from "lodash";
import { useDispatch } from "react-redux";

import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import ColorPicker from "components/ColorPicker/ColorPicker";
import Button from "components/Button/Button";
import {
  ColorGroup,
  ColorGroupHashMap,
  Username,
  UsernameState,
} from "store/file/types";
import UsernameList from "components/UsernameList/UsernameList";
import { AppDispatch } from "store/store";
import { saveColorChanges, updateUnsavedColors } from "store/file/slice";
import { overrideReactType } from "utils/utils";

import "./style.scss";

const { useForm } = Form;

export interface ColorDetailsProps {
  colors: ColorGroupHashMap;
  unsavedColors: ColorGroupHashMap;
  allUsernames: Username[];
  selectedColorKey: string;
}

const ColorDetails: FunctionalComponent<ColorDetailsProps> = (props) => {
  const { colors, unsavedColors, selectedColorKey, allUsernames } = props;
  const originalColor = colors[selectedColorKey];
  const selectedColor = unsavedColors[selectedColorKey] || originalColor;
  const [form] = useForm();
  const dispatch: AppDispatch = useDispatch();

  const resetValues = useCallback(() => {
    const unsavedColorsCopy = cloneDeep(unsavedColors);

    form.setFieldsValue({
      name: originalColor.name,
      color: originalColor.color,
      usernames: originalColor.usernames,
    });

    delete unsavedColorsCopy[selectedColorKey];
    dispatch(updateUnsavedColors(unsavedColorsCopy));
  }, [form, unsavedColors, originalColor, selectedColorKey, dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      name: selectedColor.name,
      color: selectedColor.color,
      usernames: selectedColor.usernames,
    });
  }, [selectedColorKey]);

  const onFinish = useCallback(() => {
    const unsavedColorsCopy = cloneDeep(unsavedColors);
    const unsavedColor = unsavedColorsCopy[selectedColorKey];
    const colorsCopy = cloneDeep(colors);
    const usernamesCopy = cloneDeep(allUsernames);

    unsavedColor.usernames = unsavedColor.usernames
      .map((el) => {
        if (!el.state) {
          return el;
        }

        if (el.state === UsernameState.UNSAVED) {
          delete el.state;
          return el;
        }

        const index = usernamesCopy.findIndex(
          (username) => el.id === username.id
        );
        const deletedUsername = usernamesCopy[index];
        usernamesCopy.splice(index, 1);

        if (deletedUsername.nameColorId === selectedColorKey) {
          colorsCopy[deletedUsername.contourColorId].usernames = colorsCopy[
            deletedUsername.contourColorId
          ].usernames.filter((username) => username.id === deletedUsername.id);

          return null;
        }

        if (deletedUsername.contourColorId === selectedColorKey) {
          colorsCopy[deletedUsername.nameColorId].usernames = colorsCopy[
            deletedUsername.contourColorId
          ].usernames.filter((username) => username.id === deletedUsername.id);
        }

        return null;
      })
      .filter((el) => el !== null) as Username[];

    const newColors = {
      ...colorsCopy,
      [selectedColorKey]: unsavedColor,
    };

    delete unsavedColorsCopy[selectedColorKey];

    dispatch(
      saveColorChanges({
        colors: newColors,
        usernames: usernamesCopy,
        unsavedColors: unsavedColorsCopy,
      })
    );
  }, [selectedColorKey, unsavedColors, colors, allUsernames, dispatch]);

  const onValuesChange = useCallback(
    (changedValues: Partial<ColorGroup>, allValues: ColorGroup) => {
      const originalColor = colors[selectedColorKey];
      const unsavedColorsCopy = cloneDeep(unsavedColors);

      if (
        unsavedColorsCopy[selectedColorKey] &&
        isEqual(originalColor, allValues)
      ) {
        delete unsavedColorsCopy[selectedColorKey];
      } else {
        unsavedColorsCopy[selectedColorKey] = allValues;
      }

      dispatch(updateUnsavedColors(unsavedColorsCopy));
    },
    [unsavedColors, selectedColorKey, colors, dispatch]
  );
  return (
    <div className="color-details-content">
      <div className="color-details-content-header">
        <h2 className="color-details-content-header-text">
          {originalColor.name}
        </h2>
        <div className="color-details-content-header-color">
          <ColoredSquare size={36} color={selectedColor.color} />
          <span className="color-details-content-header-color-data">
            <span className="color-details-content-header-color-data-red">
              Red: {originalColor.color.r}
            </span>{" "}
            <span className="color-details-content-header-color-data-green">
              Green: {originalColor.color.g}
            </span>{" "}
            <span className="color-details-content-header-color-data-blue">
              Blue: {originalColor.color.b}
            </span>
          </span>
        </div>
      </div>
      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          {overrideReactType(
            <>
              <Form.Item
                name="name"
                label="Color Group Name"
                rules={[
                  { required: true, message: "Color Group Name is required" },
                ]}
              >
                {overrideReactType(<Input />)}
              </Form.Item>
              <Form.Item label="RGB Color" name="color">
                {overrideReactType(<ColorPicker />)}
              </Form.Item>
              <Form.Item name="usernames">
                {overrideReactType(
                  <UsernameList
                    allUsernames={allUsernames}
                    colors={colors}
                    selectedColorKey={selectedColorKey}
                  />
                )}
              </Form.Item>
              <div className="color-details-content-buttons">
                <Button
                  type="submit"
                  icon={<AiOutlineCheck />}
                  className="color-details-content-buttons-btn"
                >
                  Save
                </Button>
                <Button
                  onClick={resetValues}
                  icon={<AiOutlineClose />}
                  className="color-details-content-buttons-btn"
                  variant="bordered"
                >
                  Reset
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ColorDetails;
