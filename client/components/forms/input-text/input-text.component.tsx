import React, { FC, ChangeEvent, Dispatch, SetStateAction } from "react";

import s from "./input-text.module.css";

type InputTextProps = {
  value: string;
  placeholder?: string;
  error?: string;
  children?: string | React.ReactNode;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
};

const InputText: FC<InputTextProps> = ({
  value,
  placeholder = "",
  error,
  children,
  name,
  onChange,
  disabled = false,
  type = "text",
}) => {
  return (
    <div className={s.container}>
      <div className={`${s.label} ${!!error && s.error}`}>{children}</div>
      <input
        className={`${s.input} ${!!error && s.error} ${
          !!disabled && s.disabled
        }`}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {!!error && <div className={s.errorMsg}>{error}</div>}
    </div>
  );
};

export default InputText;
