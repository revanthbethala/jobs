import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import Profile from "@/components/profile/Profile";
import { useAuthStore } from "./store/authStore";
import SideNav from "./components/SideNav";
import LandingPage from "./pages/Home";
import Jobs from "./components/jobs/Jobs";

export default function App() {
  const { isLoggedIn } = useAuthStore();
  console.log("isLoggedIn:", isLoggedIn); // <--- Add this line

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <SideNav /> : <LandingPage />,
      children: isLoggedIn
        ? [
            {
              index: true,
              path: "jobs",
              element: <Jobs />,
            },
            {
              path: "profile",
              element: <Profile />,
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
