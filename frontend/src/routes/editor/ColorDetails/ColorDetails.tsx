// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TypeScript no-check due to preact issue with react types
import { FunctionalComponent, h } from "preact";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Form, Input } from "antd";
import { useCallback, useEffect } from "preact/hooks";
import { cloneDeep, isEqual } from "lodash";
import { useDispatch } from "react-redux";

import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import ColorPicker from "components/ColorPicker/ColorPicker";
import Button from "components/Button/Button";
import { ColorGroup, ColorGroupHashMap } from "store/file/types";
import UsernameList from "components/UsernameList/UsernameList";
import { AppDispatch } from "store/store";
import { updateUnsavedColors } from "store/file/slice";

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
  const selectedColor =
    unsavedColors[selectedColorKey] || colors[selectedColorKey];
  const [form] = useForm();
  const dispatch: AppDispatch = useDispatch();

  const resetValues = useCallback(() => {
    const originalColor = colors[selectedColorKey];
    const unsavedColorsCopy = cloneDeep(unsavedColors);

    form.setFieldsValue({
      name: originalColor.name,
      color: originalColor.color,
      usernames: originalColor.usernames,
    });

    delete unsavedColorsCopy[selectedColorKey];
    dispatch(updateUnsavedColors(unsavedColorsCopy));
  }, [form, unsavedColors, colors, selectedColorKey, dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      name: selectedColor.name,
      color: selectedColor.color,
      usernames: selectedColor.usernames,
    });
  }, [selectedColorKey]);

  const onFinish = useCallback((values) => {
    console.log(values);
  }, []);

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
          {selectedColor.name}
        </h2>
        <div className="color-details-content-header-color">
          <ColoredSquare size={36} color={selectedColor.color} />
          <span className="color-details-content-header-color-data">
            <span className="color-details-content-header-color-data-red">
              Red: {selectedColor.color.r}
            </span>{" "}
            <span className="color-details-content-header-color-data-green">
              Green: {selectedColor.color.g}
            </span>{" "}
            <span className="color-details-content-header-color-data-blue">
              Blue: {selectedColor.color.b}
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
          <Form.Item
            name="name"
            label="Color Group Name"
            rules={[
              { required: true, message: "Color Group Name is required" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="RGB Color" name="color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="usernames">
            <UsernameList
              allUsernames={allUsernames}
              colors={colors}
              selectedColorKey={selectedColorKey}
            />
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
        </Form>
      </div>
    </div>
  );
};

export default ColorDetails;
