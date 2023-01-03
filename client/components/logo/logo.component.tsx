import React, { FC } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/pro-regular-svg-icons";

import s from "./logo.module.css";

type LogoProps = {
  size?: string;
  link?: boolean;
  variant?: "light" | "dark";
};

const Logo: FC<LogoProps> = ({
  size = "16px",
  link = true,
  variant = "dark",
}) => {
  return (
    <>
      {link ? (
        <Link to="/">
          <FontAwesomeIcon
            icon={faCrosshairs}
            className={`${s.icon} ${s[variant]}`}
          />
          <span className={`${s.text} ${s[variant]}`}>AiQ</span>
        </Link>
      ) : (
        <div className={`text-[${size}]`}>
          <FontAwesomeIcon
            icon={faCrosshairs}
            className={`${s.icon} ${s[variant]}`}
          />
          <span className={`${s.text} ${s[variant]}`}>AiQ</span>
        </div>
      )}
    </>
  );
};

export default Logo;
