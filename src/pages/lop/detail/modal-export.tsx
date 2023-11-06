import { Button, DatePicker, Form, Input, Modal } from "antd";
import { FC, useEffect, useState } from "react";

import { SiMicrosoftexcel } from "react-icons/si";
import dayjs from "dayjs";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import { useTranslation } from "react-i18next";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  data?: any;
  translation: string;
  exportAll?: boolean;
  api: any;
  apiExportAll: any;
  text: string;
}
const ModalExport: FC<Props> = ({
  showModal,
  setShowModal,
  data,
  translation,
  exportAll,
  api,
  apiExportAll,
  text
}) => {
  const { t } = useTranslation(translation);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const authUser = useAppSelector(getAuthUser);
  const onFinish = async (values: any) => {
    const dateTime = values.date ? dayjs(values.date) : null;
    setLoading(true);

    try {
      if (exportAll) {
        await apiExportAll({
          ...data,
          ...values,
          date: dateTime ? dateTime.format("DD/MM/YYYY") : null
        });
        return;
      }
      const res = await api({
        ...data,
        ...values,
        date: dateTime ? dateTime.format("DD/MM/YYYY") : null
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${text}-${data.ma}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowModal(false);
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
      setShowModal(false);
      form.resetFields();
    }
  };
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };
  useEffect(() => {
    if (!authUser) return;
    form.setFieldsValue({ username: authUser.info?.name });
  }, [form, authUser]);
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
          <p className="modal-title">
            {exportAll ? t("title.export_all") : t("title.export")}
          </p>
        </div>
        <Form
          initialValues={{ role_code: "student" }}
          layout="vertical"
          className="base-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label="Tên giảng viên" name="username">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Địa điểm" name="class">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Ngày" name="date">
            <DatePicker />
          </Form.Item>
          <Form.Item className="flex justify-end items-center">
            <Button className="mr-4" onClick={() => handleCancel()}>
              Huỷ
            </Button>
            <Button htmlType="submit" loading={loading}>
              Xuất file
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalExport;
