import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role does not match
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;