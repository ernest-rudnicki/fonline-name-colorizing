import { parseFileContent } from "store/file/helpers";
import { removeAdditionalSpaces, splitByNewLine } from "utils/utils";

const testFileContent = `
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

describe("File store helpers", () => {
  test("parses file content properly", () => {
    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(testFileContent))
    );
    expect(Object.entries(result.colors).length).toBe(10);
    expect(Object.entries(result.usernames).length).toBe(6);
  });

  test("the color is properly assigned", () => {
    const test = `@   NameCvet          250 230 90`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );

    expect(result.colors["NameCvet"].color).toMatchObject({
      r: 250,
      g: 230,
      b: 90,
    });
  });

  test("the color is properly assigned when there are more colors", () => {
    const test = `
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
@   NameGray          173 173 185
`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );

    expect(result.colors["NameCvet"].color).toMatchObject({
      r: 250,
      g: 230,
      b: 90,
    });

    expect(result.colors["ContourCvet"].color).toMatchObject({
      r: 120,
      g: 190,
      b: 220,
    });

    expect(result.colors["NameGray"].color).toMatchObject({
      r: 173,
      g: 173,
      b: 185,
    });
  });

  test("there are no usernames created if file does not contain them", () => {
    const test = `
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
@   NameGray          173 173 185
`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );
    expect(result.usernames.length).toBe(0);
  });

  test("username is properly created", () => {
    const test = `
>   cvet             NameCvet          ContourCvet
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );
    expect(result.usernames[0]).toMatchObject({
      name: "cvet",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });
  });

  test("colors contain the username", () => {
    const test = `
>   cvet             NameCvet          ContourCvet
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );

    expect(result.colors["NameCvet"].usernames[0]).toMatchObject({
      name: "cvet",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });

    expect(result.colors["ContourCvet"].usernames[0]).toMatchObject({
      name: "cvet",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });
  });

  test("colors contain more usernames", () => {
    const test = `
>   cvet             NameCvet          ContourCvet
>   test      NameCvet	       ContourCvet
@   NameCvet          250 230 90
@   ContourCvet       120 190 220
`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );

    expect(result.colors["NameCvet"].usernames[0]).toMatchObject({
      name: "cvet",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });

    expect(result.colors["ContourCvet"].usernames[0]).toMatchObject({
      name: "cvet",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });

    expect(result.colors["NameCvet"].usernames[1]).toMatchObject({
      name: "test",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });

    expect(result.colors["ContourCvet"].usernames[1]).toMatchObject({
      name: "test",
      nameColor: "NameCvet",
      contourColor: "ContourCvet",
    });
  });

  test("when the color line is does not have correct structure, do not parse color", () => {
    const test = `@   NameCvet          250 230`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );
    expect(result.colors["NameCvet"]).toBe(undefined);
  });

  test("when the username line is does not have correct structure, do not parse color", () => {
    const test = `>   cvet             NameCvet`;

    const result = parseFileContent(
      splitByNewLine(removeAdditionalSpaces(test))
    );

    expect(result.usernames.length).toBe(0);
  });
});
