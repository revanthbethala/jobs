import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteType = {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g., ["admin"], ["user"], ["admin", "user"]
};

function ProtectedRoute({
  children,
  allowedRoles = ["USER", "ADMIN"],
}: ProtectedRouteType) {
  const { token, isLoggedIn, role } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking login...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
