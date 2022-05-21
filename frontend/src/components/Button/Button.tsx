import { Tooltip } from "antd";
import { GenericPreactContent, PreactMouseEvent } from "generic/generic";
import { FunctionalComponent, h, VNode } from "preact";
import { useCallback } from "preact/hooks";
import { joinClassNames, overrideReactType } from "utils/utils";

import "./style.scss";

export interface ButtonProps {
  children?: GenericPreactContent;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "standard" | "bordered" | "minimal" | "text" | "rounded-square";
  size?: "medium" | "between" | "small" | "tiny" | "icon";
  color?: "primary" | "danger" | "grayish";
  mode?: "dark" | "light";
  tooltipText?: string;
  disabled?: boolean;
  icon?: VNode;
  dataTestId?: string;
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
    dataTestId,
    type = "button",
    variant = "standard",
    size = "medium",
    mode = "light",
    color = "primary",
  } = props;

  const _onClick = useCallback(
    (e: PreactMouseEvent) => {
      if (!onClick || disabled) {
        return;
      }

      onClick(e);
    },
    [onClick, disabled]
  );

  return (
    <Tooltip overlay={tooltipText} placement="bottom">
      {overrideReactType(
        <button
          data-testid={dataTestId}
          onClick={_onClick}
          disabled={disabled}
          type={type}
          className={joinClassNames([
            "btn",
            variant,
            size,
            mode,
            color,
            className,
          ])}
        >
          <div className="btn-content">
            {icon && <span className="btn-content-icon">{icon}</span>}
            {children && <span className="btn-content-text">{children}</span>}
          </div>
        </button>
      )}
    </Tooltip>
  );
};

export default Button;
