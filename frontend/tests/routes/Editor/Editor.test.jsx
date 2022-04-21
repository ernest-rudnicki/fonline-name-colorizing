import { h } from "preact";
import { fireEvent, render, screen } from "@testing-library/preact";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import Editor from "routes/Editor/Editor";
import { changeSelectedColor } from "store/file/slice";

jest.mock("store/file/slice");

const usernames = [
  {
    name: "testUsername1",
    contourColor: "testNameColor",
    nameColor: "testContourColor",
  },
  {
    name: "testEnemy",
    contourColor: "testNameColor",
    nameColor: "testEnemyContourColor",
  },
  {
    name: "testFriend",
    contourColor: "testFriendColor",
    nameColor: "testFriendContourColor",
  },
];

const initialState = {
  file: {
    colors: {
      testNameColor: {
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[0], usernames[1]],
      },
      testContourColor: {
        color: {
          red: 255,
          green: 255,
          blue: 255,
        },
        usernames: [usernames[0]],
      },
      testEnemyContourColor: {
        color: {
          red: 255,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[1]],
      },
      testFriendColor: {
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [usernames[3]],
      },
      testFriendContourColor: {
        color: {
          red: 0,
          green: 0,
          blue: 255,
        },
        usernames: [usernames[3]],
      },
    },
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

    expect(await screen.findByText("testNameColor")).toBeTruthy();
    expect(await screen.findByText("testContourColor")).toBeTruthy();
    expect(await screen.findByText("testEnemyContourColor")).toBeTruthy();
    expect(await screen.findByText("testFriendColor")).toBeTruthy();
    expect(await screen.findByText("testFriendContourColor")).toBeTruthy();
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
        selectedColorKey: "testNameColor",
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

  test("triggers select color", async () => {
    render(
      <Provider store={store}>
        <Editor />
      </Provider>
    );

    fireEvent.click(screen.getByText("testNameColor"));
    expect(changeSelectedColor).toBeCalledTimes(1);
    expect(changeSelectedColor).toBeCalledWith("testNameColor");
  });
});
