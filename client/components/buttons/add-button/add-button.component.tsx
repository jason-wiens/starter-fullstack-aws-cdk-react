import React, { FC } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

import s from "./add-button.module.css";

type AddButtonProps = {
  onClick: () => void;
  color?: "primary" | "accent" | "green";
  children: React.ReactNode;
  expand?: "left" | "right";
};

const AddButton: FC<AddButtonProps> = ({
  onClick,
  color = "green",
  children,
  expand = "left",
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button className={`${s.container} ${s[color]}`} onClick={handleClick}>
      <FontAwesomeIcon icon={faPlus} className={s.icon} />
      <div className={`${s.label} ${s[expand]}`}>{children}</div>
    </button>
  );
};

export default AddButton;
