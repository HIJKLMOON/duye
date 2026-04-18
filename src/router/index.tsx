import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Spin } from "antd";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const UserManage = lazy(() => import("../pages/user/UserManage"));
const RoleManage = lazy(() => import("../pages/role/RoleManage"));
const MenuManage = lazy(() => import("../pages/menu/MenuManage"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Notifications = lazy(
  () => import("../pages/notifications/Notifications"),
);

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <Spin size="large" />
  </div>
);

const router = createBrowserRouter([
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
        element: <Login />,
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
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "user",
        element: (
          <Suspense fallback={<Loading />}>
            <UserManage />
          </Suspense>
        ),
      },
      {
        path: "role",
        element: (
          <Suspense fallback={<Loading />}>
            <RoleManage />
          </Suspense>
        ),
      },
      {
        path: "menu",
        element: (
          <Suspense fallback={<Loading />}>
            <MenuManage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loading />}>
            <Notifications />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
