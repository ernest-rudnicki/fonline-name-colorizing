import { h } from "preact";
import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import UsernameList from "components/UsernameList/UsernameList";
import { addMatchMedia } from "utils/testing-utils";
import userEvent from "@testing-library/user-event";
import { UsernameState } from "store/file/types";

addMatchMedia();
jest.mock("uuid", () => ({
  v4: () => "username4",
}));

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

const colors = {
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
};

describe("UsernameList rendering", () => {
  test("renders content properly", async () => {
    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
      />
    );

    expect(await screen.findByDisplayValue("testUsername1")).toBeTruthy();
    expect(await screen.findByDisplayValue("testEnemy")).toBeTruthy();

    const nameColors = await screen.findAllByText("testNameColor");
    const testContourColors = await screen.findAllByText("testContourColor");
    const testEnemyContourColors = await screen.findAllByText(
      "testEnemyContourColor"
    );

    expect(nameColors.length).toBe(2);
    expect(testContourColors.length).toBe(1);
    expect(testEnemyContourColors.length).toBe(1);

    const btns = await screen.findAllByRole("button");
    expect(btns.length).toBe(3);
  });
});

describe("UsernameList actions", () => {
  test("fires onChange handler when clicking on delete button", async () => {
    const onChange = jest.fn();
    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );

    const btns = await screen.findAllByRole("button");
    fireEvent.click(btns[0]);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      {
        id: "username1",
        name: "testUsername1",
        nameColorId: "id2",
        contourColorId: "id1",
        state: UsernameState.DELETED,
      },
      {
        id: "username2",
        name: "testEnemy",
        contourColorId: "id1",
        nameColorId: "id3",
      },
    ]);
  });

  test("fires onChange handler when clicking on add new username", async () => {
    const onChange = jest.fn();
    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );

    fireEvent.click(await screen.findByText("Add new username"));
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
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
        id: "username4",
        name: "",
        nameColorId: "id1",
        contourColorId: "id1",
        state: UsernameState.UNSAVED,
      },
    ]);
  });

  test("removes unsaved username entirely", async () => {
    const onChange = jest.fn();
    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );

    fireEvent.click(await screen.findByText("Add new username"));
    const btns = await screen.findAllByRole("button");
    fireEvent.click(btns[2]);

    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith([
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
    ]);
  });

  test("shows error when the username arleady exists", async () => {
    const onChange = jest.fn();

    const colorsWithDuplicatedUsername = {
      id1: {
        name: "testNameColor",
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[0], usernames[1]],
      },
    };

    render(
      <UsernameList
        value={colorsWithDuplicatedUsername["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Add new username"));
    const inputs = await screen.findAllByLabelText("Username");
    await userEvent.type(inputs[2], "testFriend");

    await waitFor(async () => {
      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith([
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
          id: "username4",
          name: "testFriend",
          contourColorId: "id1",
          errors: {
            name: "Username assigned to:\ntestFriendContourColor and testFriendColor",
          },
          nameColorId: "id1",
          state: UsernameState.UNSAVED,
        },
      ]);
    });
  });

  test("removes error when there are no duplicated usernames", async () => {
    const onChange = jest.fn();

    const colorsWithDuplicatedUsername = {
      id1: {
        name: "testNameColor",
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
        usernames: [usernames[0], usernames[1]],
      },
    };

    render(
      <UsernameList
        value={colorsWithDuplicatedUsername["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Add new username"));
    const inputs = await screen.findAllByLabelText("Username");
    await userEvent.type(inputs[2], "testFriend");
    await new Promise((resolve) =>
      setTimeout(async () => {
        await userEvent.type(inputs[2], "test");
        resolve();
      }, 400)
    );

    await waitFor(async () => {
      expect(onChange).toBeCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith([
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
          id: "username4",
          name: "testFriendtest",
          contourColorId: "id1",
          nameColorId: "id1",
          state: UsernameState.UNSAVED,
        },
      ]);
    });
  });

  test("triggers on change when selecting new name color", async () => {
    const onChange = jest.fn();

    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );
    const selects = await screen.findAllByRole("combobox");
    await userEvent.click(selects[0]);
    await userEvent.click(await screen.findByText("testFriendColor"));

    await waitFor(async () => {
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith([
        {
          id: "username1",
          name: "testUsername1",
          contourColorId: "id1",
          nameColorId: "id4",
        },
        {
          id: "username2",
          name: "testEnemy",
          contourColorId: "id1",
          nameColorId: "id3",
        },
      ]);
    });
  });
  test("triggers on change when selecting new contour color", async () => {
    const onChange = jest.fn();

    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );
    const selects = await screen.findAllByRole("combobox");
    await userEvent.click(selects[1]);
    await userEvent.click(await screen.findByText("testFriendColor"));

    await waitFor(async () => {
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith([
        {
          id: "username1",
          name: "testUsername1",
          contourColorId: "id4",
          nameColorId: "id2",
        },
        {
          id: "username2",
          name: "testEnemy",
          contourColorId: "id1",
          nameColorId: "id3",
        },
      ]);
    });
  });

  test("triggers if route when onChange is not passed", async () => {
    const spy = jest.spyOn(console, "log");

    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
      />
    );
    fireEvent.click(screen.getByText("Add new username"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("triggers if route when the are no errors on the item", async () => {
    const spy = jest.spyOn(console, "log");
    const onChange = jest.fn();
    render(
      <UsernameList
        value={colors["id1"].usernames}
        colors={colors}
        selectedColorKey="id1"
        allUsernames={usernames}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Add new username"));
    const inputs = await screen.findAllByLabelText("Username");
    await userEvent.type(inputs[2], "testInput");

    await waitFor(async () => {
      expect(spy).toBeCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(
        "triggers if route when the are no errors on the item"
      );
    });
  });
});
