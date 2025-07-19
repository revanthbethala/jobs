import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import SideNav from "./components/SideNav";
import LandingPage from "./pages/Home";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import AppliedJobs from "./components/jobs/user/AppliedJobs";
import ProtectedRoute from "./components/landing/ProtectedRoute";
import { JobPostingForm } from "./pages/JobPosting";
// import JobPosting from "./pages/JobPosting";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const isLoggedIn = useAuthStore.getState().isLoggedIn;
console.log(isLoggedIn)
const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedIn ? (
      <ProtectedRoute>
        <SideNav />
      </ProtectedRoute>
    ) : (
      <LandingPage />
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "post-jobs",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <JobPostingForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "applied-jobs",
        element: <AppliedJobs />,
      },
    ],
  },
  {
    path: "/auth",
    element: isLoggedIn ? <SideNav /> : <AuthPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster />
  </QueryClientProvider>
);
