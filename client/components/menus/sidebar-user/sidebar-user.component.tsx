import { Link, useLocation } from "react-router-dom";
import { AppRoutes } from "client/routes/app/routes.app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUser } from "@fortawesome/pro-light-svg-icons";

import s from "./sidebar-user.module.css";

const SidebarProjectsMenu = () => {
  const location = useLocation();

  return (
    <div>
      <h3 className={s.menuTitle}>Projects</h3>
      <ul className={s.menuList}>
        <li
          className={`${s.menuItem} ${
            location.pathname === AppRoutes.Dashboard ? s.active : ""
          }`}
        >
          <Link to={AppRoutes.Dashboard}>
            <FontAwesomeIcon icon={faFileUser} className="mr-3" /> My Projects
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarProjectsMenu;
