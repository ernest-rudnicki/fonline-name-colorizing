import { GenericPreactContent, PreactMouseEvent } from "generic/generic";
import { FunctionalComponent, h, VNode } from "preact";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface ButtonProps {
  children?: GenericPreactContent;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "standard" | "bordered" | "minimal" | "text";
  size?: "medium" | "small" | "tiny" | "icon";
  mode?: "dark" | "light";
  tooltipText?: string;
  disabled?: boolean;
  icon?: VNode;
  onClick?: (e: PreactMouseEvent) => void;
}

const Button: FunctionalComponent<ButtonProps> = (props) => {
  const {
    children,
    className,
    icon,
    tooltipText,
    onClick,
    disabled,
    type = "button",
    variant = "standard",
    size = "medium",
    mode = "light",
  } = props;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={joinClassNames(["btn", variant, size, mode, className])}
    >
      {tooltipText && <div className="btn-tooltip">{tooltipText}</div>}
      <div className="btn-content">
        {icon && <span className="btn-content-icon">{icon}</span>}
        {children && <span className="btn-content-text">{children}</span>}
      </div>
    </button>
  );
};

export default Button;
