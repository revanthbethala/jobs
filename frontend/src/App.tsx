import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import SideNav from "./components/SideNav";
import LandingPage from "./pages/Home";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import AppliedJobs from "./components/jobs/AppliedJobs";

export default function App() {
  const { isLoggedIn } = useAuthStore();

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <SideNav /> : <LandingPage />,
      children: isLoggedIn
        ? [
            {
              index: true,
              path: "/",
              element: <Jobs />,
            },
            {
              path: "jobs",
              element: <Jobs />,
            },
            {
              path: "job/:id/profile",
              element: <Profile forceEditing={true} showEditButton={false} />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "applied-jobs",
              element: <AppliedJobs />,
            },
          ]
        : [],
    },
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
