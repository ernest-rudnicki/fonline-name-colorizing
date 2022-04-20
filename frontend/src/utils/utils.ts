import { Entries } from "generic/generic";
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

export function splitByNewLine(text: string): string[] {
  return text.split(/\r?\n/);
}

export function removeAdditionalSpaces(text: string): string {
  return text.replace(/[^\S\r\n]+/g, " ").trim();
}

export function parseIntBaseTen(textNumber: string): number {
  return parseInt(textNumber, 10);
}

export function joinClassNames(
  classNames: Array<string | null | undefined>
): string {
  return classNames.filter((el) => !!el).join(" ");
}

export function getEntries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}

export function isTestingEnv(): boolean {
  return (
    process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test"
  );
}
