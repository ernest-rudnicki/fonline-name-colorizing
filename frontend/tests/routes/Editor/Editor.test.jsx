import { h } from "preact";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import Editor from "routes/Editor/Editor";
import {
  changeSelectedColor,
  updateUnsavedColors,
  saveColorChanges,
} from "store/file/slice";
import { addMatchMedia } from "utils/testing-utils";
import { UsernameState } from "store/file/types";

addMatchMedia();
jest.mock("store/file/slice");

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
        usernames: [usernames[3]],
      },
      id5: {
        name: "testFriendContourColor",
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [usernames[3]],
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

    expect(screen.getAllByRole("button").length).toBe(6);

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
        },
        usernames: [usernames[1], usernames[2]],
      });
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
});
