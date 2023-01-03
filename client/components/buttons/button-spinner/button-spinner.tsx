import React from "react";

import s from "./button-spinner.module.css";

type ButtonSpinnerProps = {
  color?: "primary" | "secondary" | "accent";
};

const ButtonSpinner = ({ color = "primary" }: ButtonSpinnerProps) => {
  return (
    <div className={s.container}>
      <svg
        className={s.spinner}
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={`${s.path} ${s[color]}`}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          cx="12"
          cy="12"
          r="10"
        ></circle>
      </svg>
    </div>
  );
};

export default ButtonSpinner;
