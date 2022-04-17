import { GenericPreactContent, PreactMouseEvent } from "generic/generic";
import { FunctionalComponent, h, VNode } from "preact";
import { joinClassNames } from "utils/utils";

import "./style.scss";

export interface ButtonProps {
  children?: GenericPreactContent;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "standard" | "bordered" | "minimal";
  size?: "medium" | "tiny" | "icon";
  mode?: "dark" | "light";
  disabled?: boolean;
  icon?: VNode;
  onClick?: (e: PreactMouseEvent) => void;
}

const Button: FunctionalComponent<ButtonProps> = (props) => {
  const {
    children,
    className,
    icon,
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
      <div className="btn-content">
        {icon && <span className="btn-content-icon">{icon}</span>}
        {children && <span className="btn-content-text">{children}</span>}
      </div>
    </button>
  );
};

export default Button;
