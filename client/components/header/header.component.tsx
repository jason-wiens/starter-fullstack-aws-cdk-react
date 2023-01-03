import { UserMenu } from "components/menus";

import s from "./header.module.css";

const HeaderApp = () => {
  return (
    <header className={s.container}>
      <UserMenu />
    </header>
  );
};

export default HeaderApp;
