import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import AuthPage from "./pages/AuthPage";

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
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      {/* <QueryClientProvider query={query} /> */}
    </>
  );
}
