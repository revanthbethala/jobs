import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import Profile from "@/components/profile/Profile";

export default function App() {
  // const query = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/profile",
      element: <Profile />
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
      {/* <QueryClientProvider query={query} /> */}
    </>
  );
}
