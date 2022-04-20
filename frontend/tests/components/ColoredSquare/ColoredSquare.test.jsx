import { h } from "preact";
import ColoredSquare from "components/ColoredSquare/ColoredSquare";
import { shallow } from "enzyme";

describe("ColoredSquare rendering", () => {
  test("renders a component", () => {
    const context = shallow(
      <ColoredSquare
        color={{
          red: 0,
          green: 0,
          blue: 0,
        }}
      />
    );
    expect(context.getElement).toBeTruthy();
  });
});
