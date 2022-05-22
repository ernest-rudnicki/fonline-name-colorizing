import { DirectoryItem, Entries } from "generic/generic";
import { neutralino } from "neutralino/neutralino";
import { VNode } from "preact";

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

export function debounce<Args extends any[], F extends (...args: Args) => any>(
  fn: F,
  delay: number
): (...args: Args) => void {
  let timerId: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function overrideReactType(el: VNode): React.ReactNode {
  return el as React.ReactNode;
}
