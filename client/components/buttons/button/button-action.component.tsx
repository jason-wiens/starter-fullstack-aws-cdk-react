import React, { FC } from "react";

import { ButtonSpinner } from "components/buttons";

import s from "./button.module.css";

type color = "primary" | "secondary" | "accent";

type ActionButtonProps = {
  color?: color;
  action: (() => void) | (() => Promise<void>);
  styles?: string;
  children: React.ReactNode;
  busy?: boolean;
  disabled?: boolean;
};

const ActionButton: FC<ActionButtonProps> = ({
  color = "primary",
  action,
  children,
  styles = "",
  busy = false,
  disabled = false,
}) => {
  return (
    <>
      {disabled ? (
        <div className={s.disabled}>{children}</div>
      ) : (
        <button
          className={`${s.button} ${s[color]} ${styles} ${
            !!busy ? s.loading : ""
          }`}
          onClick={() => action()}
        >
          {busy && <ButtonSpinner color={color} />}
          {children}
        </button>
      )}
    </>
  );
};

export default ActionButton;
