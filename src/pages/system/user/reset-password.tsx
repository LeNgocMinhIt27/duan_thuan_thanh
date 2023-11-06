import userApi from "@/api/admin/user.api";
import { convertErrorAxios } from "@/api/axios";
import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { User } from "@/interface/user";
import { Form, Input, Modal, notification } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiMicrosoftexcel } from "react-icons/si";

interface Props {
  showModal: boolean;
  data: User;
  setShowModal: (value: boolean) => void;
}
const ResetPassword: FC<Props> = ({ showModal, setShowModal, data }) => {
  const { t } = useTranslation("user-manager-modal");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
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
      await userApi.resetPassword(data, values);
      api.success({
        message: t("message.success_reset_password"),
        description: t("message.success_desc_reset_password")
      });
      setShowModal(false);
      form.resetFields();
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_reset_password"),
          description: t("message.error_desc_reset_password")
        });
        const { response } = res.error;
        if (response) setErrorMessage(response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
  };
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setErrorMessage(null);
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        footer={<></>}
        className="relative"
        open={showModal}
        onCancel={() => handleCancel()}
      >
        <div className="create-icon">
          <div>
            <SiMicrosoftexcel />
          </div>
        </div>
        <div className="modal-title-wapper">
          <p className="modal-title">{t("title.reset_password")}</p>
          <p>{t("sub_title.reset_password")}</p>
        </div>
        <Form
          layout="vertical"
          className="base-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Xác nhận mật khẩu admin"
            name="current_password"
            rules={[
              {
                required: true,
                message: `Hãy nhập thông tin cho trường xác nhận mật khẩu admin`
              }
            ]}
            validateStatus={validateForm(
              errorMessage?.errors?.current_password?.length
            )}
            help={
              errorMessage?.errors?.current_password
                ? errorMessage?.errors?.current_password[0]
                : undefined
            }
          >
            <Input.Password
              onChange={() => handleChange("password")}
            ></Input.Password>
          </Form.Item>
          <Form.Item
            label="Mật khẩu thay đổi"
            name="password"
            rules={[{ required: true, message: t("required.password") }]}
            validateStatus={validateForm(
              errorMessage?.errors?.password?.length
            )}
            help={
              errorMessage?.errors?.password
                ? errorMessage?.errors?.password[0]
                : undefined
            }
          >
            <Input.Password
              onChange={() => handleChange("password")}
            ></Input.Password>
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="password_confirmation"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Xác nhận mật khẩu của bạn!"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không trùng khớp"));
                }
              })
            ]}
            validateStatus={validateForm(
              errorMessage?.errors?.password_confirmation?.length
            )}
            help={
              errorMessage?.errors?.password_confirmation
                ? errorMessage?.errors?.password_confirmation[0]
                : undefined
            }
          >
            <Input.Password
              onChange={() => handleChange("password_confirmation")}
            ></Input.Password>
          </Form.Item>
          <Form.Item className="absolute bottom-0 right-0 left-0 px-6 pt-4 bg-white">
            <div className="flex justify-between gap-4">
              <ColorButton block onClick={handleCancel}>
                Huỷ
              </ColorButton>
              <ColorButton
                block
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                Thay đổi mật khẩu
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPassword;
