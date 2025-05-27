import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If token is missing, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected page
  return children;
}
