import React, { FC } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";

import s from "./check-box.module.css";

type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

const CheckBox: FC<CheckBoxProps> = ({
  checked,
  onChange,
  children,
  disabled,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onChange();
  };

  return (
    <div className={s.container} onClick={handleClick}>
      <div
        className={`${s.checkbox} ${checked ? s.checked : ""} ${
          disabled ? s.disabled : ""
        }`}
      >
        {checked && (
          <FontAwesomeIcon
            icon={faCheck}
            className={`${s.checkIcon} ${disabled ? s.disabled : ""}`}
          />
        )}
      </div>
      <div className={s.label}>{children}</div>
    </div>
  );
};

export default CheckBox;
