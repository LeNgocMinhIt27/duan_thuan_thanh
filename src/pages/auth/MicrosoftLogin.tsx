import {
  authErrorMessage,
  authLoading,
  loginMicrosoftAction
} from "@/stores/features/auth";
import { notification } from "antd";
import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageLoading } from "../Loading";
import { useAppDispatch, useAppSelector } from "@/stores/hook";

const MicrosoftLogin: FC = () => {
  const isLoading = useAppSelector(authLoading);
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(authErrorMessage);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!code) {
      api.error({
        message: "Thất bại",
        description: "Thiếu thông tin đăng nhập qua tài khoản Microsoft"
      });
    } else {
      dispatch(loginMicrosoftAction(code));
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      api.error({
        message: "Thất bại",
        description: errorMessage
      });
    }
  }, [errorMessage]);

  return (
    <div className="h-full w-full">
      {contextHolder}
      {isLoading && <PageLoading />}
    </div>
  );
};

export default MicrosoftLogin;
