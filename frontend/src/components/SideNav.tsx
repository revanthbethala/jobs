import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { User, Briefcase, FileText, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/use-mobile";

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logOut } = useAuthStore();
  const isMobile = useIsMobile();
  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const toggleSidebar = () => {
    if (!isMobile) setIsSidebarOpen(!isSidebarOpen);
    else setIsSidebarOpen(!isMobile);
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Applied Jobs", path: "/applied-jobs", icon: FileText },
  ];

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden ">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white shadow-lg h-full fixed top-0 left-0 flex flex-col justify-between transition-all duration-300 ease-in-out z-10",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-1 py-3 gap-2 rounded-xl transition-all duration-200",
                    "hover:bg-blue-50 hover:text-blue-600",
                    isActive
                      ? "bg-blue-100 text-blue-600  font-medium"
                      : "text-gray-700",
                    isSidebarOpen ? "" : "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t  border-gray-200">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200",
              "hover:bg-red-50 hover:text-red-600 text-gray-700 w-full"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "lg:ml-16 ml-10 transition-all duration-300 w-full lg:p-6 px-3",
          isSidebarOpen && "ml-64"
        )}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SideNav;
