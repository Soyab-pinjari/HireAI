
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Check login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  console.log("ACCESS GRANTED - Rendering Dashboard");

  return children;
};

export default ProtectedRoute;
