import { FC, useState } from "react";
import { Form, Input, Modal, Select, notification } from "antd";

import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import { convertErrorAxios } from "@/api/axios";
import { useTranslation } from "react-i18next";
import userApi from "@/api/admin/user.api";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setKeyRender: (value: number) => void;
}
const CreateUser: FC<Props> = ({ showModal, setShowModal, setKeyRender }) => {
  const { t } = useTranslation("user-manager-modal");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);

  const option = [
    { value: "admin", label: "Quản trị" },
    { value: "assistant", label: "Trợ lý" },
    { value: "teacher", label: "Giảng viên" }
    // { value: "student", label: "Student" },
  ];
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
      await userApi.create(values);
      api.success({
        message: t("message.success_add"),
        description: t("message.success_desc_add")
      });
      setShowModal(false);
      form.resetFields();
      setKeyRender(Math.random());
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_add"),
          description: t("message.error_desc_add")
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
          <p className="modal-title">{t("title.create_new")}</p>
          <p>{t("sub_title.create_new")}</p>
        </div>
        <Form
          initialValues={{ role_code: "student" }}
          layout="vertical"
          className="base-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: t("required.username") }]}
            validateStatus={validateForm(
              errorMessage?.errors?.username?.length
            )}
            help={
              errorMessage?.errors?.username
                ? errorMessage?.errors?.username[0]
                : undefined
            }
          >
            <Input onChange={() => handleChange("username")}></Input>
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
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
            name="confirmpassword"
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
              errorMessage?.errors?.confirmpass?.length
            )}
            help={
              errorMessage?.errors?.confirmpass
                ? errorMessage?.errors?.confirmpass[0]
                : undefined
            }
          >
            <Input.Password
              onChange={() => handleChange("confirmpass")}
            ></Input.Password>
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="roles"
            rules={[{ required: true, message: t("required.role_code") }]}
            validateStatus={validateForm(
              errorMessage?.errors?.role_code?.length
            )}
            help={
              errorMessage?.errors?.roles
                ? errorMessage?.errors?.roles[0]
                : undefined
            }
          >
            <Select
              mode="multiple"
              options={option}
              onChange={() => handleChange("roles")}
            ></Select>
          </Form.Item>
          <Form.Item className="absolute bottom-0 right-0 left-0 px-6 pt-4 bg-white">
            <div className="flex justify-between gap-4">
              <ColorButton block onClick={handleCancel}>
                {t("action.cancel")}
              </ColorButton>
              <ColorButton
                block
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                {t("action.accept")}
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
