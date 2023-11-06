import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import { Button, Form, Modal, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  data?: any;
  translation: string;
  api: any;
  text: string;
}
const ModalExportPK: FC<Props> = ({ showModal, setShowModal, api, text }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [kiHoc, setKihoc] = useState<{ label: string; value: string }[]>([]);
  const authUser = useAppSelector(getAuthUser);
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await api(values);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${text}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
  }, []);
  useEffect(() => {
    const getKihoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data.map((x: any) => ({ value: x, label: x })));
      }
    };
    getKihoc();
  }, []);
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
          <p className="modal-title">Xuất danh sách phúc khảo</p>
        </div>
        <Form
          initialValues={{ role_code: "student" }}
          layout="vertical"
          className=""
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label="Kì học" name="ki_hoc">
            <Select options={kiHoc}></Select>
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

export default ModalExportPK;
