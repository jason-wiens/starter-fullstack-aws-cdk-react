import React, { FC } from "react";
import { Link } from "react-router-dom";

import s from "./button.module.css";

type color = "primary" | "accent" | "white" | "gray";

type LinkButtonProps = {
  color: color;
  to: string;
  styles?: string;
  children: React.ReactNode;
};

const Button: FC<LinkButtonProps> = ({ color, to, children, styles = "" }) => {
  const createRipple = (e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const position = button.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - position.left - radius}px`;
    circle.style.top = `${e.clientY - position.top - radius}px`;
    circle.classList.add(s.ripple);

    const ripple = button.getElementsByClassName(s.ripple)[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return (
    <Link to={to}>
      <button
        className={`${s.button} ${s[color]} ${styles}`}
        onClick={createRipple}
      >
        {children}
      </button>
    </Link>
  );
};

export default Button;
