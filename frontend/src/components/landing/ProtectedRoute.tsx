import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g., ["USER"], ["ADMIN"], ["USER", "ADMIN"]
};

function ProtectedRoute({
  children,
  allowedRoles = ["USER", "ADMIN"],
}: ProtectedRouteProps) {
  const { token, isLoggedIn, role } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn || !token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
