import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav>
        <div className="max-w-7xl mx-auto md:px-4 lg:px-8 py-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <div className="w-9 h-9 text-brand-blue-light font-extrabold rounded-lg flex items-center justify-center">
                <User size={27} />
              </div>
              <span className="text-xl font-bold text-brand-blue-dark">
                ProfileBuilder
              </span>
            </div>

            {/* Buttons Section */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 w-full xs:w-auto"
                onClick={() => navigate("update-profile")}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Update Profile</span>
              </Button>
              <Button
                className="flex items-center justify-center gap-2 w-full xs:w-auto"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">View Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
