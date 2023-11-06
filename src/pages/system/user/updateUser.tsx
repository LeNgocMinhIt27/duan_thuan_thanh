import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Select, notification } from "antd";

import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import { User } from "@/interface/user";
import { convertErrorAxios } from "@/api/axios";
import { useTranslation } from "react-i18next";
import userApi from "@/api/admin/user.api";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  data: User;
  setKeyRender: (value: number) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}
const UpdateUser: FC<Props> = ({
  showModal,
  setShowModal,
  data,
  setKeyRender,
  isEdit,
  setIsEdit
}) => {
  const { t } = useTranslation("user-manager-modal");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [disabled, setDisabled] = useState(false);
  const option = [
    { value: "admin", label: "Quản trị" },
    { value: "assistant", label: "Trợ lý" },
    { value: "teacher", label: "Giảng viên" }
    // { value: "student", label: "Sinh viên" },
  ];
  useEffect(() => {
    if (!data.roles) return;
    if (data.roles.includes("student")) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [data]);
  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      await userApi.edit({ ...data, ...values });
      api.success({
        message: t("message.success_edit"),
        description: t("message.success_desc_edit")
      });
      setShowModal(false);
      form.resetFields();
      setKeyRender(Math.random());
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_edit"),
          description: t("message.error_desc_edit")
        });
        const { response } = res.error;
        if (response) setErrorMessage(response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data && isEdit) {
      form.setFieldsValue(data);
    }
  }, [data, form, isEdit]);
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setErrorMessage(null);
    setIsEdit(false);
  };
  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
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
          <p className="modal-title">{t("title.edit")}</p>
          <p>{t("sub_title.edit")}</p>
        </div>
        <Form
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
            <Input></Input>
          </Form.Item>
          <Form.Item
            name="roles"
            label="Vai trò"
            rules={[{ required: true }]}
            help={
              errorMessage?.errors?.roles
                ? errorMessage?.errors?.roles[0]
                : undefined
            }
          >
            <Select
              mode="multiple"
              options={option}
              disabled={disabled}
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
                {t("action.edit")}
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUser;
