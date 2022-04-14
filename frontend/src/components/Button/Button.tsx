import { PreactMouseEvent } from "generic/generic";
import { FunctionalComponent, h } from "preact";

import "./style.scss";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "standard" | "bordered";
  size?: "medium";
  disabled?: boolean;
  onClick?: (e: PreactMouseEvent) => void;
}

const Button: FunctionalComponent<ButtonProps> = (props) => {
  const {
    children,
    className,
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
      {children}
    </button>
  );
};

export default Button;
