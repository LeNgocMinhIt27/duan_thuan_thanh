import "@/assets/styles/tailwind.css";
import "@/assets/styles/main.scss";

import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import router from "@/router";
import { PageLoading } from "./pages/Loading";
import { getInitData, logout } from "./stores/features/auth";
import { ConfigProvider, message as $message, App } from "antd";
import vi from "antd/locale/vi_VN";
import { GlobalHandlers } from "./api/axios/error-handle";
import { isServerError, isTokenInvalid } from "./api/axios";
import { AxiosError } from "axios";
import { LaravelServerErrorResponse } from "./interface/axios/laravel";
import { useAppDispatch } from "./stores/hook";
import configApi from "./api/config.api";
import { setKiHocHienGio } from "./stores/features/config";

const AppMain = () => {
  const dispatch = useAppDispatch();
  configApi.getKiHienGio().then((res) => {
    dispatch(setKiHocHienGio(res.data));
  });
  dispatch(getInitData());
  GlobalHandlers.setFunctionShowMessage((message) => {
    $message.error(message);
  });
  GlobalHandlers.registerMany({
    Unauthenticated: {
      check: isTokenInvalid,
      before() {
        dispatch(logout());
      },
      message: "Đăng xuất"
    },
    500: {
      check: isServerError,
      before(e) {
        const error = e as AxiosError<LaravelServerErrorResponse>;
        error &&
          error.response &&
          error.response.data &&
          error.response.data.message &&
          $message.error(error.response.data.message);
      }
    }
  });
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#0747A6" },
        components: {
          Typography: {
            colorText: "rgb(23, 43, 77)"
          },
          Select: {
            controlItemBgActive: "#E2E4E9",
            colorFillSecondary: "#E2E4E9",
            algorithm: true
          },
          Table: {
            rowHoverBg: "#e4e4e4",
            borderColor: "#c0c0c0"
            //algorithm: true
          }
        }
      }}
      locale={vi}
    >
      <App>
        <Suspense fallback={<PageLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </App>
    </ConfigProvider>
  );
};

export default AppMain;
