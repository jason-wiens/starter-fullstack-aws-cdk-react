import React, { FC } from "react";

import { User } from "models";

import s from "./avatar.module.css";

type AvatarProps = {
  user?: User;
};

const Avatar: FC<AvatarProps> = ({ user }) => {
  if (!user) {
    return <div className={s.loading}></div>;
  }

  const { firstName, lastName, avatarUrl } = user;
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}`;

  return <div className={s.avatar}>{initials}</div>;
};

export default Avatar;
