import "@/assets/styles/main.scss";

import {
  Alert,
  Button,
  Card,
  Form,
  Image,
  Input,
  Row,
  Space,
  Typography
} from "antd";
import { IoMdLock, IoMdMail } from "react-icons/io";
import {
  authErrorMessage,
  authLoading,
  loginAction
} from "@/stores/features/auth";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import imgLogoUrl from "@/assets/static/logo.png";

import { BsMicrosoftTeams } from "react-icons/bs";
import type { FC } from "react";
import { LoginParams } from "@/interface/user/login";
import { sdk } from "@/api/axios";
import { useTranslation } from "react-i18next";

const Login: FC = () => {
  const { t } = useTranslation("login");
  const { Title } = Typography;
  const errorMessage = useAppSelector(authErrorMessage);
  const isLoading = useAppSelector(authLoading);
  const dispatch = useAppDispatch();
  const onFinish = async (values: LoginParams) => {
    dispatch(loginAction({ ...values }));
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100%" }}>
      <Space direction="vertical">
        <Card
          className="smh:max-h-[70vh] sm:w-[600px]"
          style={{ background: "#ffff", minWidth: "27vw" }}
        >
          <Form
            layout="vertical"
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image src={imgLogoUrl} preview={false} height={90} />
            </div>
            <Title
              className="login-title"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "3px 0"
              }}
              level={3}
            >
              {t("title.head")}
            </Title>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập thông tin cho trường tài khoản"
                }
              ]}
            >
              <Input
                className="set-height"
                placeholder={t("hint.username")}
                autoComplete="username"
                type="text"
                prefix={
                  <IoMdMail style={{ fontSize: "130%" }} fill="#F3C309" />
                }
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập thông tin cho trường mật khẩu"
                }
              ]}
            >
              <Input.Password
                className="set-height"
                placeholder={t("hint.password")}
                autoComplete="current-password"
                prefix={
                  <IoMdLock style={{ fontSize: "150%" }} fill="#F3C309" />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="set-height"
                style={{ background: "#F3C309" }}
                htmlType="submit"
                loading={isLoading}
                block
              >
                {t("action.login")}
              </Button>
            </Form.Item>
          </Form>
          <Button
            className="set-height"
            type="primary"
            style={{ marginBottom: "12px" }}
            block
            icon={<BsMicrosoftTeams style={{ fontSize: "130%" }} />}
            onClick={async () => {
              const res = await sdk.get("auth/getMicrosoftLoginUrl");
              const url = res.data.data;
              window.location.href = url;
            }}
          >
            {t("action.microsoft")}
          </Button>
          <p style={{ textAlign: "center", paddingTop: "5px" }}>
            <a href="quen-mat-khau">{t("action.forgot_pass")}</a>
          </p>
          {errorMessage && (
            <Alert className="set-height" message={errorMessage} type="error" />
          )}
        </Card>
      </Space>
    </Row>
  );
};

export default Login;
