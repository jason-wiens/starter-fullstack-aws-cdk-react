import { User } from "models/user.model";
import React, { FC } from "react";

import { Avatar } from "components/avatar";

import s from "./table.module.css";

type ColumnType = "user" | "regular" | "badge";
type BadgeColor = "accent" | "blue" | "green" | "red" | "yellow" | "gray";
type Alignment = "left" | "center" | "right";

type TableRow = { [columnName: string]: any };

type TableProps = {
  data: TableRow[];
  action?: (row: any) => void;
  options?: {
    columnWidths?: string[];
    columnAlignments?: Alignment[];
    columnTypes?: ColumnType[];
    badgeColors?: { [badge: string]: BadgeColor };
    padding?: string;
  };
};

const Table: FC<TableProps> = ({ data, action, options }) => {
  const padding = options?.padding || "px-8 py-4";
  const columnNames = Object.keys(data[0]);
  const columnAlignments =
    options?.columnAlignments?.map((name) => {
      if (name === "center") return "justify-center";
      if (name === "right") return "justify-end";
      return "justify-start";
    }) || [];

  const renderUserColumn = (user: User) => {
    const { firstName, lastName, email } = user;

    return (
      <div className={s.userColumn}>
        <Avatar user={user} />
        <div className={s.userMeta}>
          <div className={s.userName}>
            {firstName} {lastName}
          </div>
          <div className={s.userEmail}>{email}</div>
        </div>
      </div>
    );
  };

  const renderBadgeColumn = (badge: string) => {
    const color = options?.badgeColors?.[badge] || "blue";

    return (
      <div className={s.badgeColumn}>
        <div className={`${s.badge} ${s[color]}`}>{badge}</div>
      </div>
    );
  };

  const renderRegularColumn = (value: any) => {
    return <div className={s.regularColumn}>{value}</div>;
  };

  const renderRow = (row: { [columnHeader: string]: any }) => {
    const values = Object.values(row);
    return (
      <>
        {values.map((value, i) => {
          const type = options?.columnTypes?.[i] || "regular";
          const defaultWidth = `w-[${Math.floor(100 / values.length)}%]`;
          const width = options?.columnWidths?.[i] || defaultWidth;
          const alignment = columnAlignments[i] || "justify-start";
          switch (type) {
            case "user":
              return (
                <div
                  key={i}
                  className={`${s.cell} ${width} ${padding} ${alignment}`}
                >
                  {renderUserColumn(value)}
                </div>
              );
            case "badge":
              return (
                <div
                  key={i}
                  className={`${s.cell} ${width} ${padding} ${alignment}`}
                >
                  {renderBadgeColumn(value)}
                </div>
              );
            default:
              return (
                <div
                  key={i}
                  className={`${s.cell} ${width} ${padding} ${alignment}`}
                >
                  {renderRegularColumn(value)}
                </div>
              );
          }
        })}
      </>
    );
  };

  return (
    <div className={s.table}>
      <div className={s.header}>
        {columnNames.map((header, i) => {
          const defaultWidth = `w-[${Math.floor(100 / columnNames.length)}%]`;
          const width = options?.columnWidths?.[i] || defaultWidth;
          const alignment = columnAlignments[i] || "justify-start";
          return (
            <div
              key={i}
              className={`${s.headerColumn} ${padding} ${width} ${alignment}`}
            >
              {header}
            </div>
          );
        })}
      </div>
      <div className={s.body}>
        {data.map((row, i) => (
          <div
            key={i}
            className={`${s.row} ${action ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (!!action) action(row);
            }}
          >
            {renderRow(row)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
