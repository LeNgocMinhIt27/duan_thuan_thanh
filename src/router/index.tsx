import {
  AdminRoute,
  AssistantRoute,
  StudentRoute,
  TeacherRoute
} from "./modules";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import { ErrorBoundary } from "./error-router";
import { GuestOnlyRoute } from "./privateRoute";
import Page500 from "@/pages/error/500";
import { PageLoading } from "@/pages/Loading";
import { ROLE } from "@/interface/user";
import type { RouteObject } from "react-router";
import WrapperRouteComponent from "./config";
import { getPrefix } from "@/constant";
import { lazy } from "react";
import QuenMatKhau from "@/pages/quen-matkhau";
import ChangePassword from "@/pages/quen-matkhau/resetPassword";

const MainLayout = lazy(() => import("@/Layout/MainLayout"));
const NotFound = lazy(() => import("@/pages/error/404"));
const LoginPage = lazy(() => import("@/pages/auth/Login"));
const MicrosoftLoginPage = lazy(() => import("@/pages/auth/MicrosoftLogin"));
const routeList: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={getPrefix() + "/login"} />
  },
  {
    path: "/loading",
    element: <PageLoading />
  },
  {
    path: getPrefix(),
    element: <WrapperRouteComponent element={<MainLayout />} guest />,
    children: [
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "microsoftLogin",
        element: <MicrosoftLoginPage />
      },
      {
        path: "quen-mat-khau",
        element: <QuenMatKhau />
      },
      {
        path: "doi-mat-khau",
        element: <ChangePassword />
      }
    ]
  },
  {
    path: getPrefix(),
    errorElement: <ErrorBoundary />,
    element: <WrapperRouteComponent element={<MainLayout />} auth />,
    children: [
      {
        path: "",
        element: <GuestOnlyRoute />
      },
      {
        path: "",
        element: (
          <WrapperRouteComponent
            element={<Outlet />}
            auth
            roles={[ROLE.admin, ROLE.assistant]}
          />
        ),
        children: AdminRoute
      },
      {
        path: "",
        element: (
          <WrapperRouteComponent
            element={<Outlet />}
            auth
            role={ROLE.teacher}
          />
        ),
        children: TeacherRoute
      },
      {
        path: "",
        element: (
          <WrapperRouteComponent
            element={<Outlet />}
            auth
            role={ROLE.student}
          />
        ),
        children: StudentRoute
      },
      {
        path: "",
        element: (
          <WrapperRouteComponent
            element={<Outlet />}
            auth
            roles={[ROLE.admin, ROLE.assistant]}
          />
        ),
        children: AssistantRoute
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "500",
    element: <Page500 />
  }
];

const RenderRouter = createBrowserRouter(routeList);

export default RenderRouter;
