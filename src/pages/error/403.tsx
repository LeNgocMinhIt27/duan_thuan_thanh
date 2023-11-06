import { Button, Result } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { FC } from "react";
import { getPrefix } from "@/constant";

export const Page403: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const route_login = getPrefix() + "/login";
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${route_login}${
                "?from=" + encodeURIComponent(location.pathname)
              }`,
              { replace: true }
            )
          }
        >
          Go To Login
        </Button>
      }
    />
  );
};
