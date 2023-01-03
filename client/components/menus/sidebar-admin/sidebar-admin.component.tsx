import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AppRoutes } from "client/routes/app/routes.app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGear,
  faFileInvoiceDollar,
  faBuilding,
} from "@fortawesome/pro-regular-svg-icons";

import s from "./sidebar-admin.module.css";
import { appendFile } from "fs";

const AdminMenu = () => {
  const location = useLocation();
  return (
    <div>
      <h3 className={s.menuTitle}>Administration</h3>
      <ul className={s.menuList}>
        <li
          className={`${s.menuItem} ${
            location.pathname === AppRoutes.Users ||
            location.pathname === AppRoutes.NewUser
              ? s.active
              : ""
          }`}
        >
          <Link to={AppRoutes.Users}>
            <FontAwesomeIcon icon={faUserGear} className="mr-2" />
            Users
          </Link>
        </li>
        <li
          className={`${s.menuItem} ${
            location.pathname === AppRoutes.Organization ? s.active : ""
          } mb-0`}
        >
          <Link to={AppRoutes.Organization}>
            <FontAwesomeIcon icon={faBuilding} className="mr-4" />
            Organization
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
