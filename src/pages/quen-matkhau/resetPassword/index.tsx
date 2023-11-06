import { Card, Image, Input, Row, Space, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";

import ColorButton from "@/components/Button";
import { Form } from "antd/lib";
import { Link } from "react-router-dom";
import forgotPassword from "@/api/forgotandresetpassword/forgotPassword.api";
import imgLogoUrl from "@/assets/static/logo.png";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const ChangePassword: React.FC = () => {
  const [show, setShow] = useState(true);
  const [text, setText] = useState(
    "Đường dẫn đã quá hạn vui lòng thực hiện lại bước gửi Email"
  );
  const [token] = useState(urlParams.get("token"));
  const { t } = useTranslation("response");
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const { Title } = Typography;

  const onFinish = async (values: any) => {
    const postData = {
      token: token,
      password: values.password,
      "confirm-password": values.confirmPassword
    };

    setLoading(true);
    try {
      if (postData) {
        await forgotPassword.resetPassword(postData);
        setText("Cập nhật mật khẩu thành công");
        setShow(false);
        api.success({
          message: t("updated-success"),
          description: t("updated-success")
        });
      }
    } catch (err: any) {
      api.error({
        message: t("updated-error"),
        description: t("updated-error")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkToken() {
      setLoading(true);
      try {
        if (token) {
          await forgotPassword.checkToken({ token: token });
          setShow(true);
        }
      } catch (err: any) {
        setShow(false);
        setText("Đường dẫn đã quá hạn vui lòng thực hiện lại bước gửi Email");
      } finally {
        setLoading(false);
      }
    }
    checkToken();
  }, [token]);

  return (
    <>
      {contextHolder}
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Space direction="vertical">
          <Card
            className="smh:max-h-[70vh] sm:w-[600px]"
            style={{ background: "#ffff", minWidth: "30vw" }}
          >
            {!show && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "left",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px"
                  }}
                >
                  <Title
                    className="login-title"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "3px 10px",
                      fontSize: "17px"
                    }}
                    level={3}
                  >
                    {text}
                  </Title>
                  <Image src={imgLogoUrl} preview={false} height={80} />
                </div>
                <Link to="../login" className="w-full">
                  <ColorButton
                    block
                    htmlType="submit"
                    loading={loading}
                    type="primary"
                  >
                    Đăng nhập
                  </ColorButton>
                </Link>
              </div>
            )}

            {show && (
              <div className="my-login-validation ">
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
                    Đặt lại mật khẩu
                  </Title>
                  <Image src={imgLogoUrl} preview={false} height={80} />
                </div>

                <Form
                  {...layout}
                  method="POST"
                  noValidate
                  onFinish={onFinish}
                  style={{ maxWidth: 500 }}
                >
                  <Form.Item
                    name="password"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }, // Điều này kiểm tra ít nhất 6 ký tự
                      {
                        pattern:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
                        message:
                          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái thường, một số và một ký tự đặc biệt"
                      }
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }, // Điều này kiểm tra ít nhất 6 ký tự
                      {
                        pattern:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
                        message:
                          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái thường, một số và một ký tự đặc biệt"
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Mật khẩu không trùng khớp");
                        }
                      })
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                  <Form.Item>
                    <ColorButton
                      block
                      htmlType="submit"
                      loading={loading}
                      type="primary"
                    >
                      Thay đổi mật khẩu
                    </ColorButton>
                  </Form.Item>
                  {!show && (
                    <div className="mb-3">
                      <Link to="login"> Đăng nhập ? </Link>
                    </div>
                  )}
                  <Form.Item>
                    <Link to="quen-mat-khau">
                      <ColorButton>Quay lại</ColorButton>{" "}
                    </Link>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Card>
        </Space>
      </Row>
    </>
  );
};

export default ChangePassword;
