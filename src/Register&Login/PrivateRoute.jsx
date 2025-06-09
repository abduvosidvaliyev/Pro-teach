import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
    const userData = localStorage.getItem("UserData");
    return userData ? <Outlet /> : <Navigate to="/" replace />;
};

export const PrivateStudentRoute = ({ children }) => {
  const studentData = localStorage.getItem("StudentData");
  return studentData ? children : <Navigate to="/" replace />;
};