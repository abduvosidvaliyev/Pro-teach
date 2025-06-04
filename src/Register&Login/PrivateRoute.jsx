import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const userData = localStorage.getItem("UserData");
    return userData ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;