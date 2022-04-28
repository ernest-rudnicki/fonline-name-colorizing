import { h } from "preact";
import ColorList from "components/ColorList/ColorList";
import { fireEvent, render, screen } from "@testing-library/preact";

const colors = {
  black: {
    color: {
      red: 0,
      green: 0,
      blue: 0,
    },
    usernames: ["Test", "Test1"],
  },
  white: {
    color: {
      red: 255,
      green: 255,
      blue: 255,
    },
    usernames: ["WhiteTest", "WhiteTest1"],
  },
  enemy: {
    color: {
      red: 255,
      green: 0,
      blue: 0,
    },
    usernames: ["EnemyTest", "EnemyTest1"],
  },
};

describe("ColorList rendering", () => {
  test("renders color buttons", async () => {
    render(<ColorList colors={colors} />);
    const buttons = await screen.findAllByRole("button");
    expect(buttons.length).toBe(3);

    expect(buttons[0].textContent).toBe("black (2)");
    expect(buttons[1].textContent).toBe("white (2)");
    expect(buttons[2].textContent).toBe("enemy (2)");
  });
  test("button is selected when selectedKey is provided", async () => {
    render(<ColorList colors={colors} selectedKey="black" />);

    expect(screen.getAllByRole("button")[0].classList).toContain("selected");
  });
});

describe("ColorList handlers", () => {
  test("triggers on click handler", async () => {
    const onClick = jest.fn();
    render(<ColorList colors={colors} onClick={onClick} />);

    fireEvent.click(screen.getByText("black (2)"));
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith("black");
  });

  test("triggers if route when no handler is provided", async () => {
    const spy = jest.spyOn(console, "log");
    render(<ColorList colors={colors} />);

    fireEvent.click(screen.getByText("black (2)"));
    expect(spy).toBeCalledTimes(1);
  });

  test("all buttons trigger on click", async () => {
    const onClick = jest.fn();
    render(<ColorList colors={colors} onClick={onClick} />);

    fireEvent.click(screen.getByText("black (2)"));
    fireEvent.click(screen.getByText("white (2)"));
    fireEvent.click(screen.getByText("enemy (2)"));

    expect(onClick).toBeCalledTimes(3);
  });
});
