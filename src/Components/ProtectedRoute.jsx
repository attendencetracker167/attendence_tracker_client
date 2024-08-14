import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();

  const location = useLocation();
  const role=user?.role=="resident"?"project-manager":user?.role=="maintainence"?"employee":user?.role=="admin"?"admin":"superadmin"
  return roles?.includes(user?.role && role) ? (
    <div className="flex ">
      <Sidebar />
      <div
        className={`h-screen flex-1 pb-8 sm:ml-[56px] `}
      > 
      <Header/>
      <div className="pt-[64px]">

        <Outlet />
      </div>
      </div>
    </div>
  ) : user?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
