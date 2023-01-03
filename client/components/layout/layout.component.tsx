import { Outlet } from "react-router-dom";

import { Sidebar } from "components/sidebar";
import { HeaderApp } from "components/header";

import s from "./layout.module.css";

const Layout = () => {
  return (
    <div className={s.layout}>
      <div className={s.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={s.mainContainer}>
        <HeaderApp />
        <div className={s.main}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
