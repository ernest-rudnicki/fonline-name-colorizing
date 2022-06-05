import { h } from "preact";
import { shallow } from "enzyme";

import ColoredSquare from "components/ColoredSquare/ColoredSquare";

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
