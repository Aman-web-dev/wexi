import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import KnowledgeBase from "./dashboard/knowledgeBase";
import Settings from "./dashboard/settings";
import TicketDetail from "./dashboard/ticketPage";
import AuthPage from "./auth/signup.tsx";
import { AuthProvider } from "./context/authContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "auth",
    Component: AuthPage,
    children: [
      {
        path: ":type",
        Component: AuthPage,
        loader: ({ params }) => {
          return { type: params.type };
        },
      },
    ],
  },
  {
    path: "dashboard",
    Component: TicketDetail,
    children: [
      { index: true, Component: TicketDetail },
      {
        path: "knowledgeBase",
        Component: KnowledgeBase,
      },
      {
        path: "settings",
        Component: Settings,
      }
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
