import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Briefcase, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-medium text-gray-600 mb-4">404</h1>
          <h2 className="text-xl text-gray-700 mb-2">Page not found</h2>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-blue-600 transition-colors text-sm">
            <Briefcase className="w-4 h-4" />
            <Link to="/"> Back to Jobs</Link>
          </button>
        </div>

        {/* <p className="text-xs text-gray-400">Need help? Contact support</p> */}
      </div>
    </div>
  );
};

export default NotFound;
