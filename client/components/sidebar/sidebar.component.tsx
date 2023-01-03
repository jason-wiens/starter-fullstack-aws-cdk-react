import React, { FC } from "react";

import { Logo } from "components/logo";
import { ProjectsMenu, AdminMenu, SuperUserMenu } from "components/menus";

import { useAuth } from "data/state";

import s from "./sidebar.module.css";

const Sidebar = () => {
  const { isAdmin, isSuperUser } = useAuth();

  return (
    <div className={s.container}>
      <div className={s.logoContainer}>
        <Logo variant="light" />
      </div>
      <div className={s.menuSection}>
        <ProjectsMenu />
      </div>
      {(isAdmin || isSuperUser) && (
        <div className={s.menuSection}>
          <AdminMenu />
        </div>
      )}
      {isSuperUser && (
        <div className={s.menuSection}>
          <SuperUserMenu />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
