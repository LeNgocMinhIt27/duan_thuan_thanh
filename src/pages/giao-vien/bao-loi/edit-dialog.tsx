import { Button, Form, Input, Modal } from "antd";
import { FC, useState } from "react";

import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTranslation } from "react-i18next";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  isEdit: boolean;
  data?: any;
  setEdit: (value: boolean) => void;
}
const EditorDialog: FC<Props> = ({
  showModal,
  setShowModal,
  isEdit,
  setEdit
}) => {
  const { t } = useTranslation("bao-loi");
  const [form] = Form.useForm();
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

  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
  };
  const handleCancel = () => {
    setShowModal(false);
    setEdit(false);
    form.resetFields();
    setErrorMessage(null);
  };
  const onFinish = () => {
    setLoading(false);
  };
  return (
    <>
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
            label="Mã lớp"
            name="ma"
            rules={[{ required: true, message: t("required.ma") }]}
            validateStatus={validateForm(errorMessage?.errors?.ma?.length)}
            help={
              errorMessage?.errors?.ma ? errorMessage?.errors?.ma[0] : undefined
            }
          >
            <Input onChange={() => handleChange("ma")}></Input>
          </Form.Item>
          <Form.Item label="Mã lớp kèm" name="ma_kem">
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Mã học phần"
            name="ma_hp"
            rules={[{ required: true, message: t("required.ma_hp") }]}
            validateStatus={validateForm(errorMessage?.errors?.ma_hp?.length)}
            help={
              errorMessage?.errors?.ma_hp
                ? errorMessage?.errors?.ma_hp[0]
                : undefined
            }
          >
            <Input onChange={() => handleChange("ma_hp")}></Input>
          </Form.Item>
          <Form.Item
            label="Tên học phần"
            name="ten_hp"
            rules={[{ required: true, message: t("required.ten_hp") }]}
            validateStatus={validateForm(errorMessage?.errors?.ten_hp?.length)}
            help={
              errorMessage?.errors?.ten_hp
                ? errorMessage?.errors?.ten_hp[0]
                : undefined
            }
          >
            <Input onChange={() => handleChange("ten_hp")}></Input>
          </Form.Item>
          <Form.Item label="Phòng" name="phong">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Loại" name="loai">
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Kì học"
            name="ki_hoc"
            rules={[{ required: true, message: t("required.ki_hoc") }]}
            validateStatus={validateForm(errorMessage?.errors?.ki_hoc?.length)}
            help={
              errorMessage?.errors?.ki_hoc
                ? errorMessage?.errors?.ki_hoc[0]
                : undefined
            }
          >
            <Input onChange={() => handleChange("ki_hoc")}></Input>
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghi_chu">
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <Form.Item className="flex justify-end items-center">
            <Button className="mr-4" onClick={() => handleCancel()}>
              Huỷ
            </Button>
            <Button htmlType="submit" loading={loading}>
              {isEdit ? "Sửa" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditorDialog;
