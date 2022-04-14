import { DirectoryItem, neutralino } from "neutralino/neutralino";

export function checkIfFileExist(
  dir: string,
  filename: string
): Promise<boolean> {
  return neutralino.filesystem.readDirectory(dir).then((content) => {
    return !!content.find(
      (el) => el.type === DirectoryItem.FILE && el.entry === filename
    );
  });
}
