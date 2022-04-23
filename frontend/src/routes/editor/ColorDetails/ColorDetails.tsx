// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TypeScript no-check due to preact issue with react types
import { FunctionalComponent, h } from "preact";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Form, Input } from "antd";

import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import ColorPicker from "components/ColorPicker/ColorPicker";
import Button from "components/Button/Button";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useCallback } from "preact/hooks";

import "./style.scss";

const { useForm } = Form;

const ColorDetails: FunctionalComponent = () => {
  const { colors, selectedColorKey } = useSelector(
    (state: RootState) => state.file
  );
  const [form] = useForm();

  const onFinish = useCallback((values) => {
    console.log(values);
  }, []);

  if (!selectedColorKey) {
    return null;
  }

  const selectedColor = colors[selectedColorKey];
  return (
    <div className="color-details-content">
      <div className="color-details-content-header">
        <h2 className="color-details-content-header-text">
          {selectedColorKey}
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
          key={selectedColorKey}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            initialValue={selectedColorKey}
            name="name"
            label="Color Group Name"
            rules={[
              { required: true, message: "Color Group Name is required" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={selectedColor.color}
            label="RGB Color"
            name="color"
          >
            <ColorPicker />
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
              type="reset"
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