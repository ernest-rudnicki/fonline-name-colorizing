import { h } from "preact";
import { shallow } from "enzyme";
import Button from "components/Button/Button";
import { AiFillPlusCircle } from "react-icons/ai";
import { render, fireEvent, screen } from "@testing-library/preact";

describe("Button rendering", () => {
  test("Standard button renders a label", () => {
    const context = shallow(<Button>Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Standard button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />}>Click me</Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Bordered button renders a label", () => {
    const context = shallow(<Button variant="bordered">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Bordered button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} variant="bordered">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Minimal button renders a label", () => {
    const context = shallow(<Button variant="minimal">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Minimal button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} variant="minimal">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Text button renders a label", () => {
    const context = shallow(<Button variant="text">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Text button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} variant="text">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Small button renders a label", () => {
    const context = shallow(<Button size="small">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Small button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} size="small">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Tiny button renders a label", () => {
    const context = shallow(<Button size="tiny">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Tiny button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} size="tiny">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Icon button renders a label", () => {
    const context = shallow(<Button size="icon">Click me</Button>);
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Icon button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} size="icon">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });

  test("Light button renders a label", () => {
    const context = shallow(
      <Button mode="light" size="icon">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toBe("Click me");
  });

  test("Light button renders a label and icon", () => {
    const context = shallow(
      <Button icon={<AiFillPlusCircle />} mode="light">
        Click me
      </Button>
    );
    expect(context.find("button").text()).toContain("Click me");
    expect(context.containsMatchingElement(<AiFillPlusCircle />)).toEqual(true);
  });
});

describe("Button handlers", () => {
  test("onClick is called", () => {
    const onClick = jest.fn();
    render(
      <Button size="icon" onClick={onClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toBeCalledTimes(1);
  });

  test("onClick is not called when button is disabled", () => {
    const onClick = jest.fn();
    render(
      <Button size="icon" disabled onClick={onClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toBeCalledTimes(0);
  });
});
