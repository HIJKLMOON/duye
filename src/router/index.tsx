import { lazy, Suspense, type ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Spin } from "antd";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <Spin size="large" />
  </div>
);

const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
): ReactElement => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: lazyLoad(() => import("../pages/auth/Login")),
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: lazyLoad(() => import("../pages/dashboard/Dashboard")),
      },
      {
        path: "user",
        element: lazyLoad(() => import("../pages/user/UserManage")),
      },
      {
        path: "role",
        element: lazyLoad(() => import("../pages/role/RoleManage")),
      },
      {
        path: "menu",
        element: lazyLoad(() => import("../pages/menu/MenuManage")),
      },
      {
        path: "settings",
        element: lazyLoad(() => import("../pages/settings/Settings")),
      },
      {
        path: "profile",
        element: lazyLoad(() => import("../pages/profile/Profile")),
      },
      {
        path: "notifications",
        element: lazyLoad(() => import("../pages/notifications/Notifications")),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
