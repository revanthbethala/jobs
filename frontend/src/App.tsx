// App.tsx
import { useEffect, useState, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Toaster } from "@/components/ui/toaster";
import JobApplications from "@/components/jobs/admin/JobApplications";

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy imports
const NotFound = lazy(() => import("@/pages/NotFound"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const SideNav = lazy(() => import("@/components/SideNav"));
const LandingPage = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const AppliedJobs = lazy(() => import("@/components/jobs/user/AppliedJobs"));
const ProtectedRoute = lazy(
  () => import("@/components/landing/ProtectedRoute")
);
const JobPostingForm = lazy(() =>
  import("@/pages/JobPosting").then((mod) => ({ default: mod.JobPostingForm }))
);
const PostedJobs = lazy(() => import("@/components/jobs/admin/PostedJobs"));
const JobDetails = lazy(() => import("@/components/jobs/user/JobDetails"));

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

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
