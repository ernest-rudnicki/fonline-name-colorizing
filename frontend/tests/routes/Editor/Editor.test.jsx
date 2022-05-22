import { h } from "preact";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";

import Editor from "routes/Editor/Editor";
import {
  changeSelectedColor,
  updateUnsavedColors,
  saveColorChanges,
  updateColors,
  changeValidation,
} from "store/file/slice";
import { addMatchMedia } from "utils/testing-utils";
import { UsernameState } from "store/file/types";
import { neutralino } from "neutralino/neutralino";

addMatchMedia();
jest.mock("store/file/slice");
jest.mock("neutralino/neutralino");
jest.mock("uuid", () => ({
  v4: () => "username4",
}));

neutralino.filesystem.readDirectory.mockReturnValue(
  new Promise((resolve) => {
    resolve([
      {
        type: "DIRECTORY",
        entry: "Test",
      },
    ]);
  })
);

neutralino.filesystem.writeFile.mockReturnValue(
  new Promise((resolve) => {
    resolve();
  })
);

const usernames = [
  {
    id: "username1",
    name: "testUsername1",
    contourColorId: "id1",
    nameColorId: "id2",
  },
  {
    id: "username2",
    name: "testEnemy",
    contourColorId: "id1",
    nameColorId: "id3",
  },
  {
    id: "username3",
    name: "testFriend",
    contourColorId: "id4",
    nameColorId: "id5",
  },
];

const initialState = {
  file: {
    unsavedColors: {},
    colors: {
      id1: {
        name: "testNameColor",
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[0], usernames[1]],
      },
      id2: {
        name: "testContourColor",
        color: {
          red: 255,
          green: 255,
          blue: 255,
        },
        usernames: [usernames[0]],
      },
      id3: {
        name: "testEnemyContourColor",
        color: {
          red: 255,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[1]],
      },
      id4: {
        name: "testFriendColor",
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [usernames[2]],
      },
      id5: {
        name: "testFriendContourColor",
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [usernames[2]],
      },
      id6: {
        name: "colorToDelete",
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [],
      },
    },
    usernames,
    selectedColorKey: null,
  },
};
const mockStore = configureStore([thunk]);
let store;

describe("Editor rendering", () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("renders color list", async () => {
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    expect(await screen.findByText("testNameColor (2)")).toBeTruthy();
    expect(await screen.findByText("testContourColor (1)")).toBeTruthy();
    expect(await screen.findByText("testEnemyContourColor (1)")).toBeTruthy();
    expect(await screen.findByText("testFriendColor (1)")).toBeTruthy();
    expect(await screen.findByText("testFriendContourColor (1)")).toBeTruthy();
  });

  test("renders title bar", async () => {
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    expect(await screen.findByText("Color Groups")).toBeTruthy();
  });

  test("renders selected item", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id1",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    expect(screen.getAllByRole("button")[1].className).toContain("selected");
  });
});

describe("Editor actions", () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("triggers select color", async () => {
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("testNameColor (2)"));
    expect(changeSelectedColor).toBeCalledTimes(1);
    expect(changeSelectedColor).toBeCalledWith("id1");
  });

  test("reset form values", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id1",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Reset"));
    expect(updateUnsavedColors).toBeCalledTimes(1);
  });

  test("update unsaved colors", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id1",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Add new username"));
    expect(updateUnsavedColors).toBeCalledTimes(1);
    expect(updateUnsavedColors).toBeCalledWith({
      id1: {
        name: "testNameColor",
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
        usernames: [
          usernames[0],
          usernames[1],
          {
            contourColorId: "id1",
            id: "username4",
            name: "",
            nameColorId: "id1",
            state: UsernameState.UNSAVED,
          },
        ],
      },
    });
  });

  test("submit form with removed username", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        unsavedColors: {
          id1: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [
              {
                ...usernames[0],
                state: UsernameState.DELETED,
              },
              usernames[1],
            ],
          },
        },
        selectedColorKey: "id1",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Save"));

    await waitFor(async () => {
      expect(saveColorChanges).toBeCalledTimes(1);
      expect(saveColorChanges).toHaveBeenCalledWith({
        unsavedColors: {},
        colors: {
          ...initialState.file.colors,
          id1: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [usernames[1]],
          },
          id2: {
            name: "testContourColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [],
          },
        },
        usernames: [usernames[1], usernames[2]],
      });
    });
  });

  test("submit form with removed username from name color", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        unsavedColors: {
          id5: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [
              {
                ...usernames[2],
                state: UsernameState.DELETED,
              },
            ],
          },
        },
        selectedColorKey: "id5",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Save"));

    await waitFor(async () => {
      expect(saveColorChanges).toBeCalledTimes(1);
      expect(saveColorChanges).toHaveBeenCalledWith({
        unsavedColors: {},
        colors: {
          ...initialState.file.colors,
          id5: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [],
          },
          id4: {
            name: "testFriendColor",
            color: {
              red: 0,
              green: 0,
              blue: 255,
            },
            usernames: [],
          },
        },
        usernames: [usernames[0], usernames[1]],
      });
    });
  });

  test("unsaved color is deleted when is equal to original color", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        unsavedColors: {
          id5: {
            name: "testFriendContourColor",
            color: {
              red: 0,
              green: 0,
              blue: 255,
            },
            usernames: [
              usernames[2],
              {
                id: "newUsername",
                name: "newUsername",
                contourColorId: "id5",
                nameColorId: "id5",
                state: UsernameState.UNSAVED,
              },
            ],
          },
        },
        selectedColorKey: "id5",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );
    const usernameRow = await screen.findByTestId("newUsernameTestId");
    fireEvent.click(usernameRow.querySelector("button"));

    await waitFor(async () => {
      expect(updateUnsavedColors).toBeCalledTimes(1);
      expect(updateUnsavedColors).toBeCalledWith({});
    });
  });

  test("submit form with new username", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        unsavedColors: {
          id1: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [
              usernames[0],
              usernames[1],
              {
                id: "newUsername",
                name: "newUsername",
                contourColorId: "id1",
                nameColorId: "id1",
                state: UsernameState.UNSAVED,
              },
            ],
          },
        },
        selectedColorKey: "id1",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Save"));

    await waitFor(async () => {
      expect(saveColorChanges).toBeCalledTimes(1);
      expect(saveColorChanges).toHaveBeenCalledWith({
        unsavedColors: {},
        colors: {
          ...initialState.file.colors,
          id1: {
            name: "newNameColor",
            color: {
              red: 255,
              green: 255,
              blue: 255,
            },
            usernames: [
              usernames[0],
              usernames[1],
              {
                id: "newUsername",
                name: "newUsername",
                contourColorId: "id1",
                nameColorId: "id1",
              },
            ],
          },
        },
        usernames: [
          ...usernames,
          {
            id: "newUsername",
            name: "newUsername",
            contourColorId: "id1",
            nameColorId: "id1",
          },
        ],
      });
    });
  });

  test("do not save color when there is no unsaved color", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id1",
      },
    });

    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    await waitFor(async () => {
      fireEvent.click(await screen.findByText("Save"));
      expect(saveColorChanges).toBeCalledTimes(0);
    });
  });

  test("do not submit color when there is duplicated username", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id1",
      },
    });

    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Add new username"));
    const inputs = await screen.findAllByLabelText("Username");
    await userEvent.type(inputs[2], "testFriend");

    // waits for the error to appear
    await screen.findByText(/Username assigned/);

    await waitFor(async () => {
      fireEvent.click(await screen.findByText("Save"));
      expect(saveColorChanges).toBeCalledTimes(0);
    });
  });

  test("do not submit color when there is duplicated color name", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        colors: {
          ...initialState.file.colors,
          id1: {
            ...initialState.file.colors["id1"],
            name: "",
          },
        },
        selectedColorKey: "id1",
      },
    });

    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    const input = await screen.findByLabelText("Color Group Name");
    await userEvent.type(input, "testContourColor");

    // waits for the error to appear
    await screen.findByText("Color group with this name already exists");

    await waitFor(async () => {
      fireEvent.click(await screen.findByText("Save"));
      expect(saveColorChanges).toBeCalledTimes(0);
    });
  });

  test("create new color", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id6",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("add-btn"));

    await waitFor(async () => {
      expect(updateColors).toBeCalledTimes(1);
      expect(updateColors).toBeCalledWith({
        ...initialState.file.colors,
        username4: {
          name: "",
          color: {
            r: 0,
            b: 0,
            g: 0,
          },
          usernames: [],
        },
      });
      expect(changeSelectedColor).toBeCalledTimes(1);
    });
  });

  test("delete a color", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        selectedColorKey: "id6",
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("delete-color-btn"));

    await waitFor(async () => {
      expect(updateColors).toBeCalledTimes(1);
      expect(updateColors).toBeCalledWith({
        ...initialState.file.colors,
        id6: undefined,
      });
      expect(updateUnsavedColors).toBeCalledTimes(1);
    });
  });

  test("trigger validation when there are unsaved colors", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        unsavedColors: {
          ...initialState.file.colors,
        },
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Export to file"));

    await waitFor(async () => {
      expect(changeValidation).toBeCalledTimes(1);
      expect(changeValidation).toBeCalledWith(true);
    });
  });
  test("trigger validation when there are colors without a name filled", async () => {
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        colors: {
          ...initialState.file.colors,
          id7: {
            name: "",
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
            usernames: [],
          },
        },
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Export to file"));

    await waitFor(async () => {
      expect(changeValidation).toBeCalledTimes(1);
      expect(changeValidation).toBeCalledWith(true);
    });
  });

  test("trigger file export", async () => {
    neutralino.os.showSaveDialog.mockReturnValueOnce(
      new Promise((resolve) => resolve("./NameColorizing.txt"))
    );

    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        colors: {
          id1: {
            name: "testNameColor",
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
            usernames: [
              {
                id: "username1",
                name: "testUsername1",
                contourColorId: "id1",
                nameColorId: "id1",
              },
            ],
          },
        },
        usernames: [
          {
            id: "username1",
            name: "testUsername1",
            contourColorId: "id1",
            nameColorId: "id1",
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Export to file"));

    await waitFor(async () => {
      expect(neutralino.filesystem.writeFile).toBeCalledTimes(1);
    });
  });

  test("trigger file export when there is the same file existing", async () => {
    neutralino.os.showSaveDialog.mockReturnValueOnce(
      new Promise((resolve) => resolve("./NameColorizing.txt"))
    );
    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        colors: {
          id1: {
            name: "testNameColor",
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
            usernames: [
              {
                id: "username1",
                name: "testUsername1",
                contourColorId: "id1",
                nameColorId: "id1",
              },
            ],
          },
        },
        usernames: [
          {
            id: "username1",
            name: "testUsername1",
            contourColorId: "id1",
            nameColorId: "id1",
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Export to file"));

    await waitFor(async () => {
      expect(neutralino.filesystem.writeFile).toBeCalledTimes(1);
    });
  });

  test("triggers notification if there is an error", async () => {
    neutralino.os.showSaveDialog.mockReturnValueOnce(
      new Promise((resolve) => resolve("./NameColorizing.txt"))
    );

    neutralino.filesystem.writeFile.mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject();
      })
    );
    const spy = jest.spyOn(console, "log");

    store = mockStore({
      ...initialState,
      file: {
        ...initialState.file,
        colors: {
          id1: {
            name: "testNameColor",
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
            usernames: [
              {
                id: "username1",
                name: "testUsername1",
                contourColorId: "id1",
                nameColorId: "id1",
              },
            ],
          },
        },
        usernames: [
          {
            id: "username1",
            name: "testUsername1",
            contourColorId: "id1",
            nameColorId: "id1",
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("Export to file"));

    await waitFor(async () => {
      expect(spy).toBeCalledTimes(1);
    });
  });
});
