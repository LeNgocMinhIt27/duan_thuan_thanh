import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { Card, Input, Row, Space, Typography, notification } from "antd";
import { Form, Image } from "antd/lib";
import React, { useState } from "react";
import imgLogoUrl from "@/assets/static/logo.png";
// import "./index.scss";
import { Link } from "react-router-dom";
import forgotPassword from "@/api/forgotandresetpassword/forgotPassword.api";
import { convertErrorAxios } from "@/api/axios";
import { useTranslation } from "react-i18next";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("response");
  const [api, contextHolder] = notification.useNotification();
  const { Title } = Typography;
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);

  const handleChange = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const postData = {
        username: values.email
      };
      await forgotPassword.post(postData);
      api.success({
        message: t("send-email"),
        description: t("send-email")
      });
      // form.resetFields();
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        const { response } = res.error;
        if (response) setErrorMessage(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Space direction="vertical">
          <Card
            className="smh:max-h-[70vh] sm:w-[600px]"
            style={{ background: "#ffff", minWidth: "30vw" }}
          >
            <div className="my-login-validation pt-5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "left",
                  alignItems: "center"
                }}
              >
                <Title
                  className="login-title"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "3px 0"
                  }}
                  level={3}
                >
                  Bạn quên mật khẩu
                </Title>
                <Image src={imgLogoUrl} preview={false} height={80} />
              </div>

              <p className="my-3">
                Hãy cho chúng tôi biết địa chỉ email của bạn và chúng tôi
                <br />
                sẽ gửi cho bạn liên kết đặt lại mật khẩu qua email.
              </p>
              <Form
                {...layout}
                method="POST"
                noValidate
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
              >
                <Form.Item
                  name={"email"}
                  label="E-Mail"
                  rules={[
                    {
                      type: "email",
                      message: "Trường này phải là 1 email!"
                    },
                    {
                      required: true,
                      message: "Vui lòng điền email của bạn vào"
                    }
                  ]}
                >
                  <Input
                    placeholder="Nhập địa chỉ Email của bạn"
                    onChange={handleChange}
                  />
                </Form.Item>
                <div className="mb-3">
                  <Link to="../login"> Đăng nhập ? </Link>
                </div>
                <Form.Item>
                  <ColorButton
                    block
                    htmlType="submit"
                    loading={loading}
                    type="primary"
                  >
                    Gửi liên kết mật khẩu
                  </ColorButton>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Space>
      </Row>
    </>
  );
};

export default ForgotPassword;
