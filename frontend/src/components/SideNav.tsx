import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Pen,
  UsersRound,
  Pencil,
  ChartColumnIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useAuthStore();
  const isMobile = useIsMobile();
  const { role } = useAuthStore();

  // Handle responsive behavior
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
      setIsCollapsed(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: User, roles: ["USER"] },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: ChartColumnIcon,
      roles: ["ADMIN"],
    },
    {
      name: "Users",
      path: "/users",
      icon: UsersRound,
      roles: ["ADMIN"],
    },
    {
      name: "All Jobs",
      path: "/jobs",
      icon: Briefcase,
      roles: ["USER", "ADMIN"],
    },
    {
      name: "My Job Postings",
      path: "/posted-jobs",
      icon: Briefcase,
      roles: ["ADMIN"],
    },
    {
      name: "Applied Jobs",
      path: "/applied-jobs",
      icon: FileText,
      roles: ["USER"],
    },
    {
      name: "Post a Job",
      path: "/post-job",
      icon: Pencil,
      roles: ["ADMIN"],
    },
  ];

  const sidebarWidth = isCollapsed && !isMobile ? "w-16" : "w-64";
  const mainMargin = isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64";

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200/60 h-full fixed top-0 left-0 flex flex-col justify-between transition-all duration-300 ease-in-out z-50",
          sidebarWidth,
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div>
          <div className="h-16 px-4 border-b border-gray-200/60 flex items-center justify-between">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                  JobQuest
                </h1>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              id="menu-bar"
            >
              {isMobile ? (
                <X className="h-4 w-4" />
              ) : isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            <div className="space-y-1">
              {navItems
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        "hover:bg-gray-100 hover:text-gray-900",
                        isActive
                          ? "bg-blue-50 text-blue-700 "
                          : "text-gray-600",
                        isCollapsed && !isMobile ? "justify-center px-2" : ""
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && (
                      <span className="ml-3 truncate">{item.name}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                ))}
            </div>
          </nav>
        </div>

        {/* User section and Logout */}
        <div className="border-t border-gray-200/60 p-3 space-y-2">
          {/* User info - only show when not collapsed */}
          {/* {(!isCollapsed || isMobile) && (
            <div className="flex items-center px-3 py-2 text-sm">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">
                  john@example.com
                </p>
              </div>
            </div>
          )} */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-100 transition-colors",
                  isCollapsed && !isMobile ? "px-2" : "px-3"
                )}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-3">Logout</span>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will end your session and redirect you to home
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          mainMargin
        )}
      >
        {/* Mobile header */}
        {isMobile && (
          <header className="h-16 bg-white border-b border-gray-200/60 flex items-center px-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 mr-3"
              aria-label="nav"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                <Briefcase className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Job Quest</h1>
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SideNav;
