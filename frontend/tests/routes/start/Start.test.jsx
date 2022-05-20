import { h } from "preact";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import Start from "routes/Start/Start";
import { neutralino } from "neutralino/neutralino";
import { NAME_COLORIZING_FILE_NAME } from "constants/constants";
import thunk from "redux-thunk";

jest.mock("neutralino/neutralino");

neutralino.filesystem.readDirectory.mockReturnValue(
  new Promise((resolve) => {
    resolve([
      {
        type: "DIRECTORY",
        entry: "Test",
      },
      {
        type: "FILE",
        entry: NAME_COLORIZING_FILE_NAME,
      },
    ]);
  })
);

neutralino.filesystem.readFile.mockReturnValue(
  new Promise((resolve) => resolve("file content"))
);

neutralino.os.showOpenDialog.mockReturnValue(
  new Promise((resolve) =>
    resolve([
      {
        type: "FILE",
        entry: NAME_COLORIZING_FILE_NAME,
      },
    ])
  )
);
const initialState = {};
const mockStore = configureStore([thunk]);
let store;

describe("Start rendering", () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("reads directory on mount", async () => {
    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      expect(neutralino.filesystem.readDirectory).toBeCalledTimes(1);
    });
  });

  test("renders 3 buttons", async () => {
    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      const buttons = await screen.findAllByRole("button");
      expect(buttons.length).toBe(3);
    });
  });

  test("renders two buttons if there is no expected file in the current directory", async () => {
    neutralino.filesystem.readDirectory.mockReturnValueOnce(
      new Promise((resolve) => {
        resolve([
          {
            type: "DIRECTORY",
            entry: "Test",
          },
        ]);
      })
    );

    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      const buttons = await screen.findAllByRole("button");
      expect(buttons.length).toBe(2);
    });
  });

  test("renders two buttons if the current directory is empty", async () => {
    neutralino.filesystem.readDirectory.mockReturnValueOnce(
      new Promise((resolve) => {
        resolve([]);
      })
    );

    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      const buttons = await screen.findAllByRole("button");
      expect(buttons.length).toBe(2);
    });
  });
});

describe("Start actions", () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("triggers import when clicking on found file button", async () => {
    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      fireEvent.click(screen.getByText("Click here to import it"));
      expect(neutralino.filesystem.readFile).toBeCalledTimes(1);
    });
  });

  test("triggers open dialog when clicking on import existing file button", async () => {
    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      fireEvent.click(screen.getByText("Import existing file"));
      expect(neutralino.os.showOpenDialog).toBeCalledTimes(1);
    });
  });

  test("goes if route when there is no file selected", async () => {
    neutralino.os.showOpenDialog.mockReturnValueOnce(
      new Promise((resolve) => resolve([]))
    );
    const spy = jest.spyOn(console, "log");

    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      fireEvent.click(screen.getByText("Import existing file"));
      expect(spy).toBeCalledTimes(1);
    });
  });

  test("handles error when the file to import was deleted/moved", async () => {
    neutralino.filesystem.readFile.mockReturnValueOnce(
      new Promise((resolve, reject) => reject())
    );

    const spy = jest.spyOn(console, "log");

    render(
      <Provider store={store}>
        <Start />
      </Provider>
    );

    await waitFor(async () => {
      fireEvent.click(await screen.findByText("Click here to import it"));
      expect(spy).toBeCalledTimes(1);
    });
  });
});
