import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import KnowledgeBase from "./dashboard/knowledgeBase";
import Settings from "./dashboard/settings";
import TicketDetail from "./dashboard/ticketPage";
import AuthPage from "./auth/auth.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";
import Dashboard from "./dashboard/dashboardLayout.tsx";
import Stats from "./dashboard/stats.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "auth",
    Component: AuthPage,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component:Stats },
      { path: "tickets", Component:TicketDetail }, 
      { path: "knowledgebase", Component: KnowledgeBase }, 
      { path: "settings", Component: Settings }, 
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
