import React, { FC } from "react";

import s from "./card.module.css";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  width?: string;
  margin?: string;
  padding?: string;
  className?: string;
};

const Card: FC<CardProps> = ({
  title,
  children,
  width,
  margin,
  padding,
  className,
}) => {
  return (
    <div className={`${s.container} ${margin || "mb-8"} ${width || "w-full"}`}>
      {!!title && <h2 className={s.title}>{title}</h2>}
      <div className={`${s.content} ${padding || "p-8"} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
