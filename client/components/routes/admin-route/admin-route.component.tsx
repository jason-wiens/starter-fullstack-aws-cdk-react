import { Outlet } from "react-router-dom";

import { useAuth } from "data/state";

const AdminRoute = () => {
  const { isAdmin } = useAuth();
  return (
    <>
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="text-lg font-bold italic text-red-500">
          Unauthorized Access
        </div>
      )}
    </>
  );
};

export default AdminRoute;
