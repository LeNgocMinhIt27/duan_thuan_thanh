import { ROLE_CODE, getPrefix } from "@/constant";
import {
  checkUserRoleAllow,
  checkUserRoleAllowMultiple
} from "@/interface/user/auth";

import type { FC } from "react";
import { Navigate } from "react-router-dom";
import Page404 from "@/pages/error/404";
import { PageLoading } from "@/pages/Loading";
import { ROLE } from "@/interface/user";
import { RootState } from "@/stores/index";
import type { RouteProps } from "react-router";
import { useAppSelector } from "@/stores/hook";

export const PrivateRoute: FC<{
  role?: ROLE;
  roles?: ROLE[];
  element: React.ReactNode;
}> = ({ element, role, roles }) => {
  const { logged, currentUser, loadingInfo } = useAppSelector(
    (state: RootState) => state.auth
  );

  if (!logged) {
    return <Navigate to={getPrefix() + "/login"} />;
  }
  if (loadingInfo) {
    return <PageLoading />;
  }
  if (!currentUser) {
    return <Page404 />;
  }
  if (
    roles &&
    roles.length > 0 &&
    !checkUserRoleAllowMultiple(currentUser, roles)
  ) {
    return <Page404 />;
  }
  if (role && !checkUserRoleAllow(currentUser, role)) {
    return <Page404 />;
  }
  if (!currentUser) {
    return <Navigate to={getPrefix() + "/login"} />;
  }
  return element;
};
export const GuestOnlyRoute: FC<RouteProps> = (props) => {
  const { logged, currentUser } = useAppSelector(
    (state: RootState) => state.auth
  );
  if (!logged) {
    return props.element;
  }
  if (!currentUser) {
    return <Navigate to={getPrefix()} />;
  }
  if (checkUserRoleAllow(currentUser, ROLE_CODE.ADMIN)) {
    return <Navigate to={getPrefix() + "/lop-hoc"} />;
  } else if (checkUserRoleAllow(currentUser, ROLE_CODE.TEACHER)) {
    return <Navigate to={getPrefix() + "/lop-day"} />;
  } else if (checkUserRoleAllow(currentUser, ROLE_CODE.STUDENT)) {
    return <Navigate to={getPrefix() + "/phong-hoc"} />;
  } else if (checkUserRoleAllow(currentUser, ROLE_CODE.ASSISTANT)) {
    return <Navigate to={getPrefix() + "/lop-hoc"} />;
  }
  return <Navigate to={getPrefix()} />;
};

export default PrivateRoute;
