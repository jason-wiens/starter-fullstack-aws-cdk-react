import { useEffect } from "react";

import { useUsers, useCurrentUser } from "data/state";
import { AppRoutes } from "client/routes/app/routes.app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingUser } from "@fortawesome/pro-light-svg-icons";

import { Table } from "components/table";
import { LinkButton } from "components/buttons";

import s from "./users.module.css";

const Users = () => {
  const { users, getUsers, isLoading } = useUsers();
  const { organization } = useCurrentUser();

  useEffect(() => {
    getUsers();
  }, []);

  const renderTable = () => {
    const tableData = users!.map((user) => {
      return {
        Users: user,
        Role: user.isAdmin ? "Admin" : "User",
      };
    });

    return (
      <Table
        data={tableData}
        options={{
          columnWidths: ["w-[80%]", "w-[20%]"],
          columnAlignments: ["left", "center"],
          columnTypes: ["user", "badge"],
          badgeColors: { User: "blue", Admin: "yellow" },
        }}
      />
    );
  };

  return (
    <div className={s.container}>
      <div className={s.titleCard}>
        <div className={s.logo}>
          <FontAwesomeIcon icon={faBuildingUser} className={s.logoIcon} />
        </div>
        <div>
          <h1 className={s.title}>Users</h1>
          <h2 className={s.orgTitle}>{organization?.legalName}</h2>
        </div>
      </div>
      <div className={s.contentCard}>
        <div className={s.addUserContainer}>
          <LinkButton to={AppRoutes.NewUser} color="primary">
            Add User
          </LinkButton>
        </div>
        {isLoading ? <div className="">Loading...</div> : renderTable()}
      </div>
    </div>
  );
};

export default Users;
