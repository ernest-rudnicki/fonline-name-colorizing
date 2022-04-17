import { GenericPreactContent } from "generic/generic";
import { FunctionalComponent, h } from "preact";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface ButtonProps {
  title: string;
  className?: string;
  children?: GenericPreactContent;
}

const TitleBar: FunctionalComponent<ButtonProps> = (props) => {
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
