import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

import { AppRoutes } from "client/routes/app/routes.app";

import { ActionButton } from "components/buttons";
import { Avatar } from "components/avatar";

import { useCurrentUser, useAuth } from "data/state";
import { removeAuthHeader } from "client/utils/axios.utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket } from "@fortawesome/pro-light-svg-icons";

import s from "./header-user.module.css";

const UserMenu: FC = () => {
  const { user, getCurrentUser } = useCurrentUser();
  const [busy, setBusy] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    setBusy(true);
    logout();
    removeAuthHeader();
    queryClient.removeQueries();
    navigate(AppRoutes.Login);
  };

  return (
    <div className={s.container}>
      <Avatar user={user} />
      {!!user && (
        <div className={s.userMenu}>
          <div className={s.header}>
            <div className={s.name}>
              {user.firstName} {user.lastName}
            </div>
            <div className={s.email}>{user.email}</div>
          </div>
          <div className={s.body}>
            <Link to={AppRoutes.Profile}>
              <div className={s.item}>
                <FontAwesomeIcon icon={faUser} className={s.icon} />
                Profile
              </div>
            </Link>
            <div className={s.logout}>
              <ActionButton busy={busy} action={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} className={s.icon} />
                Logout
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
