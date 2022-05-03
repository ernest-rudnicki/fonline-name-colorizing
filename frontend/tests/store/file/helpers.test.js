import { removeAdditionalSpaces, splitByNewLine } from "utils/utils";
import { parseFileContent } from "store/file/helpers";

let mockId = 0;

jest.mock("uuid", () => ({
  v4: () => mockId++,
}));

const inputText = `
>   cvet             NameCvet          ContourCvet
>   GoodBoyName*     NameGreen         ContourGreen
>   BadBoyName*      NameRed           ContourRed
>   One&Two???       NameGray          ContourYellow
>   Terminatova      NameMine	       ContourMine
>   Terminatk        NameMine	       ContourMine

@   NameCvet          250 230 90
@   ContourCvet       120 190 220
@   NameGray          173 173 185
@   NameRed           190 0   0
@   NameGreen         0   190 0
@   NameMine          0   139 139
@   ContourYellow     140 140 0
@   ContourRed        140 0   0
@   ContourGreen      0   140 0
@   ContourMine	      0   95  160
`;

describe("file store helpers", () => {
  beforeEach(() => {
    mockId = 0;
  });

  test("parses file content properly", () => {
    const lines = splitByNewLine(removeAdditionalSpaces(inputText));
    const result = parseFileContent(lines);

    expect(Object.entries(result.colors).length).toBe(10);
    expect(result.usernames.length).toBe(6);
  });

  test("parses colors properly", () => {
    const text = `@   NameCvet          250 230 90
@   ContourCvet       120 190 220
@   NameGray          173 173 185`;
    const lines = splitByNewLine(removeAdditionalSpaces(text));
    const result = parseFileContent(lines);
    expect(result.colors[0]).toMatchObject({
      name: "NameCvet",
      color: {
        r: 250,
        g: 230,
        b: 90,
      },
      usernames: [],
    });

    expect(result.colors[1]).toMatchObject({
      name: "ContourCvet",
      color: {
        r: 120,
        g: 190,
        b: 220,
      },
      usernames: [],
    });

    expect(result.colors[2]).toMatchObject({
      name: "NameGray",
      color: {
        r: 173,
        g: 173,
        b: 185,
      },
      usernames: [],
    });
  });

  test("parses colors with usernames properly", () => {
    const text = `>   cvet             NameCvet          ContourCvet
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
@   NameGray          173 173 185`;
    const lines = splitByNewLine(removeAdditionalSpaces(text));
    const result = parseFileContent(lines);
    expect(result.colors[0]).toMatchObject({
      name: "NameCvet",
      color: {
        r: 250,
        g: 230,
        b: 90,
      },
      usernames: [
        {
          id: 2,
          name: "cvet",
          nameColorId: 0,
          contourColorId: 1,
        },
      ],
    });

    expect(result.colors[1]).toMatchObject({
      name: "ContourCvet",
      color: {
        r: 120,
        g: 190,
        b: 220,
      },
      usernames: [
        {
          id: 2,
          name: "cvet",
          nameColorId: 0,
          contourColorId: 1,
        },
      ],
    });
  });

  test("does not parse color when the format is incorrect", () => {
    const text = `@   NameCvet          250 230 90 45`;
    const lines = splitByNewLine(removeAdditionalSpaces(text));
    const result = parseFileContent(lines);
    expect(Object.entries(result.colors).length).toBe(0);
  });

  test("does not parse username when the format is incorrect", () => {
    const text = `>   cvet             NameCvet          ContourCvet TestColor`;
    const lines = splitByNewLine(removeAdditionalSpaces(text));
    const result = parseFileContent(lines);
    expect(result.usernames.length).toBe(0);
  });
});
