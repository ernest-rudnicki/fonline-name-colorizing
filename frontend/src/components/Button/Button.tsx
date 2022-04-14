import { PreactMouseEvent } from "generic/generic";
import { FunctionalComponent, h, VNode } from "preact";

import "./style.scss";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "standard" | "bordered";
  size?: "medium";
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
  } = props;
  const joinedClasssName = `btn ${variant} ${size} ${className}`.trimEnd();

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={joinedClasssName}
    >
      <div className="btn-content">
        {icon && <span className="btn-content-icon">{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export default Button;
