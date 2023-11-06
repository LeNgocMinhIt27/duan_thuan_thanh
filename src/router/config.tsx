import type { FC, ReactElement } from "react";
import { GuestOnlyRoute, PrivateRoute } from "./privateRoute";

import { type RouteProps, useNavigation } from "react-router";
import { PageLoading } from "@/pages/Loading";
import { RootState } from "@/stores";
import { ROLE } from "@/interface/user";
import { useAppSelector } from "@/stores/hook";

export type WrapperRouteProps = RouteProps & {
  /** authorization？ */
  guest?: boolean;
  auth?: boolean;
  element: ReactElement;
  role?: ROLE;
  roles?: ROLE[];
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({
  auth,
  guest,
  element,
  ...props
}) => {
  const { state } = useNavigation();
  const { loadingInfo } = useAppSelector((state: RootState) => state.auth);

  if (state === "loading") {
    return <PageLoading />;
  }
  if (loadingInfo) {
    return <PageLoading />;
  }
  if (guest) return <GuestOnlyRoute {...props} element={element} />;
  if (auth) return <PrivateRoute {...props} element={element} />;
  return element as ReactElement;
};

export default WrapperRouteComponent;
