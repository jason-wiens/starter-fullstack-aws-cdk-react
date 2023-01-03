import React, { FC, useState, useEffect } from "react";

import { useUsers } from "data/state/users.state";
import { InputText } from "components/forms";
import { Table } from "components/table";

import {
  faPlus,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/pro-regular-svg-icons";
import { faUser } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { User } from "models";

import s from "./select-users.module.css";

type TableRow = {
  Name: string;
  Email: string;
  Administrator: "admin" | "user" | undefined;
};

type SelectUsersProps = {
  value: User[];
  onChange: (value: User[]) => void;
  validationError: string;
  setErrorMessage: (message: string) => void;
};

const SelectCompany: FC<SelectUsersProps> = ({
  value,
  onChange,
  validationError,
  setErrorMessage,
}) => {
  const [addingUser, setAddingUser] = useState(false);
  const [tableData, setTableData] = useState<User[]>();
  const [search, setSearch] = useState("");
  const { isLoading, users, getUsers } = useUsers();

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    if (!!users && users.length > 0) {
      const filtered = users.filter((user) =>
        `${user.firstName} ${user.firstName}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      if (filtered.length > 0) {
        setTableData(filtered);
      } else {
        setTableData([]);
      }
    }
  };

  const renderTable = () => {
    let data: TableRow[];

    if (!!tableData && tableData.length > 0) {
      data = tableData!.map((user) => {
        return {
          Name: `${user.firstName} ${user.lastName}`,
          Email: user.email,
          Administrator: user.isAdmin ? "admin" : "user",
        };
      });
    } else {
      data = [
        {
          Name: "No companies found",
          Email: "",
          Administrator: undefined,
        },
      ];
    }

    const action = (row: TableRow) => {
      const userExists = !!value.find((user) => user.email === row.Email);
      if (!userExists) {
        const newUser = users!.find((user) => user.email === row.Email);
        onChange([...value, newUser!]);
      }
      setAddingUser(false);
    };

    return (
      <Table
        data={data}
        action={action}
        options={{
          columnWidths: ["w-[40%]", "w-[40%]", "w-[20%]"],
          columnAlignments: ["left", "left", "center"],
        }}
      />
    );
  };

  const UserBadge: FC<{ user: User }> = ({ user }) => {
    return (
      <div className={s.badgeContainer}>
        <FontAwesomeIcon icon={faUser} className={s.badgeIcon} />
        <div className={s.userMeta}>
          <div
            className={s.userName}
          >{`${user.firstName} ${user.lastName}`}</div>
          <div className={s.userEmail}>{user.email}</div>
        </div>
        <FontAwesomeIcon
          icon={faTimes}
          className={s.removeIcon}
          onClick={() =>
            onChange([...value.filter((u) => u.email !== user.email)])
          }
        />
      </div>
    );
  };

  return (
    <div className={s.container}>
      {!!validationError && <div className={s.error}>{validationError}</div>}
      <div className={s.userBadges}>
        {value.map((user) => (
          <UserBadge key={user.email} user={user} />
        ))}
        {!addingUser && (
          <div
            className={s.addButton}
            onClick={() => {
              setAddingUser(true);
              setTableData(users);
              setSearch("");
              setErrorMessage("");
            }}
          >
            <FontAwesomeIcon icon={faPlus} className={s.addIcon} />
            Add User
          </div>
        )}
      </div>
      {addingUser && (
        <>
          {!!value && value.length !== 0 && <div className="mb-8"></div>}
          <div className={s.searchContainer}>
            <div className={s.search}>
              <InputText
                value={search}
                onChange={handleSearch}
                error=""
                name="search"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                Filter Companies
              </InputText>
            </div>
            {isLoading ? (
              <div className={s.loading}>Loading...</div>
            ) : (
              renderTable()
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectCompany;
