import { h } from "preact";
import { render, screen } from "@testing-library/preact";

import TitleBar from "components/TitleBar/TitleBar";

describe("TitleBar rendering", () => {
  test("renders title properly", async () => {
    render(<TitleBar title="title" />);

    expect(await screen.findByText("title")).toBeTruthy();
  });

  test("renders content properly", async () => {
    render(<TitleBar>content</TitleBar>);

    expect(await screen.findByText("content")).toBeTruthy();
  });

  test("renders content and title properly", async () => {
    render(<TitleBar title="title">content</TitleBar>);

    expect(await screen.findByText("title")).toBeTruthy();
    expect(await screen.findByText("content")).toBeTruthy();
  });
});
