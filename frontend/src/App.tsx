import { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const JobDetailsPage = lazy(() => import("./pages/JobDetailsPage"));

const NotFound = lazy(() => import("@/pages/NotFound"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const SideNav = lazy(() => import("@/components/SideNav"));
const ProfileForm = lazy(() => import("@/components/profile/ProfileForm"));
const ProfileDisplay = lazy(
  () => import("@/components/profile/ProfileDisplay")
);
const JobRounds = lazy(() => import("./components/admin/rounds/JobRounds"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UsersInfo = lazy(() => import("./components/admin/usersInfo/UsersInfo"));
const JobApplications = lazy(
  () => import("@/components/admin/JobApplications")
);
const JobPostingForm = lazy(
  () => import("@/components/admin/postjobs/JobPosting")
);
const LandingPage = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const AppliedJobs = lazy(() => import("@/components/jobs/user/AppliedJobs"));
const ProtectedRoute = lazy(
  () => import("@/components/landing/ProtectedRoute")
);
const PostedJobs = lazy(() => import("@/components/admin/PostedJobs"));
const JobDetails = lazy(() => import("@/components/jobs/user/JobDetails"));

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./services/profileService";

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { token, logOut } = useAuthStore();
  const { setEmail, setUserId, setUsername, setRole } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-info"],
    queryFn: getProfile,
    enabled: isLoggedIn,
  });

  // useEffect(() => {
  //   if (!token) {
  //     logOut();
  //     // Redirect should be handled within a layout component (not here)
  //   }
  // }, [token, logOut]);

  useEffect(() => {
    if (!isLoading && !isError && data?.user) {
      setEmail(data.user.email);
      setUserId(data.user.id);
      setUsername(data.user.username);
    }
  }, [data, isLoading, isError, setEmail, setUserId, setUsername, setRole]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? (
        <Suspense fallback={<LoadingSpinner />}>
          <ProtectedRoute>
            <SideNav />
          </ProtectedRoute>
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <LandingPage />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
                <Jobs />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "jobs/:jobId", element: <JobDetailsPage /> },
          ],
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UsersInfo />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "jobs",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
                <Jobs />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "job/:jobId",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "post-job",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <JobPostingForm />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "job-rounds/:jobId",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <JobRounds />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "update-job/:jobId",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <JobPostingForm />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "posted-jobs",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PostedJobs />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "applications/:jobId",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <JobApplications />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "profile",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["USER"]}>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileDisplay />
                </Suspense>
              ),
            },
            {
              path: "update-profile",
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileForm />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "applied-jobs",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute allowedRoles={["USER"]}>
                <AppliedJobs />
              </ProtectedRoute>
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/auth",
      element: isLoggedIn ? (
        <Suspense fallback={<LoadingSpinner />}>
          <SideNav />
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <AuthPage />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
