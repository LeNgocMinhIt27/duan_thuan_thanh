import { Navigate, useRouteError } from "react-router-dom";

import { isAxiosError } from "axios";
import { getPrefix } from "@/constant";
import Page500 from "@/pages/error/500";

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  if (isAxiosError(error)) {
    const { response } = error;
    if (response)
      switch (response.status) {
        case 404:
          return <Navigate to={getPrefix() + "/404"} />;
        case 401:
          return <Navigate to={getPrefix() + "/login"} />;
        default:
          break;
      }
  }
  // Uncaught ReferenceError: path is not defined
  return <Page500 />;
}
