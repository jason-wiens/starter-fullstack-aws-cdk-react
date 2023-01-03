import { Outlet } from "react-router-dom";

import { useAuth } from "data/state";

const SuperUserRoute = () => {
  const { isSuperUser } = useAuth();
  return (
    <>
      {isSuperUser ? (
        <Outlet />
      ) : (
        <div className="text-lg font-bold italic text-red-500">
          Unauthorized Access
        </div>
      )}
    </>
  );
};

export default SuperUserRoute;
