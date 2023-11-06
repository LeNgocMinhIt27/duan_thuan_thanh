import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

//nguoi dung
const UserPage = lazy(() => import("@/pages/system/user"));
//giao vien
const TeacherManagementPage = lazy(() => import("@/pages/user/giao-vien"));
//sinh vien
const SinhVienPage = lazy(() => import("@/pages/user/sinh-vien"));
// admin đã bao gồm cả quyền trợ lý, nên không cần thêm router của trợ lý vào

export const AdminRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="tai-khoan" />
  },
  {
    path: "tai-khoan",
    element: <UserPage />
  },
  {
    path: "giang-vien",
    element: <TeacherManagementPage />
  },
  { path: "sinh-vien", element: <SinhVienPage /> }
];
