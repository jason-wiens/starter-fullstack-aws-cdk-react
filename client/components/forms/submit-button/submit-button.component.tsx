import React, { FC } from "react";

import { ButtonSpinner } from "components/buttons";

import s from "./submit-button.module.css";

type color = "primary" | "secondary" | "accent";

type SubmitButtonProps = {
  color?: color;
  children: React.ReactNode;
  busy: boolean;
  styles?: string;
};

const Button: FC<SubmitButtonProps> = ({
  color = "primary",
  children,
  busy,
  styles,
}) => {
  return (
    <button
      className={`${s.button} ${s[color]} ${styles} ${!!busy ? s.loading : ""}`}
      type="submit"
    >
      {busy && <ButtonSpinner color={color} />}
      {children}
    </button>
  );
};

export default Button;
