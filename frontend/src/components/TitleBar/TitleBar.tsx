import { FunctionalComponent, h } from "preact";

import { GenericPreactContent } from "generic/generic";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface TitleBarProps {
  title: string;
  className?: string;
  children?: GenericPreactContent;
}

const TitleBar: FunctionalComponent<TitleBarProps> = (props) => {
  const { children, title, className } = props;

  return (
    <div className={joinClassNames(["titlebar", className])}>
      <div className="titlebar-title">
        <span className="titlebar-title-text">{title}</span>
      </div>
      <div className="titlebar-actions">{children}</div>
    </div>
  );
};

export default TitleBar;
