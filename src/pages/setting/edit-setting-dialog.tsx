import { useEffect, useState } from "react";
import { Button, Form, InputNumber, Modal } from "antd";
import Title from "antd/es/typography/Title";
import { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  openModal: boolean;
  closeModal: () => void;
  setting?: any;
  callnofi: NotificationInstance;
  api: (data: any) => Promise<any>;
  data: any;
  setKeyRender: (value: number) => any;
}
const DongDiemDanhDialog = ({
  setKeyRender,
  openModal,
  closeModal,
  callnofi,
  data,
  api
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (data.setting_value) {
      const maPhanTu = data.setting_value.split(/-|,|\[|\]/).filter(Boolean);
      form.setFieldsValue({
        mo_diem_danh: maPhanTu[0],
        dong_diem_danh: maPhanTu[1],
        dong_tre: maPhanTu[2]
      });
    }
  }, [data, form]);
  const onFinish = async (value: object) => {
    setLoading(true);
    api &&
      (await api({ ...value, id: data?.["id"] })
        .then(() => {
          callnofi.success({
            message: "Thành công",
            description: "Cài đặt ngày đóng điểm danh thành công"
          });
        })
        .catch((err) => {
          callnofi.error({
            message: "Thất bại",
            description:
              err?.response.data.message ||
              "Cài đặt ngày đóng điểm danh thất bại"
          });
        })
        .finally(() => {
          setLoading(false);
          closeModal();
          setKeyRender(Math.random());
        }));
  };
  return (
    <>
      <Modal open={openModal} onCancel={closeModal} centered footer={null}>
        <Title level={4}>Sửa tuần đóng điểm danh</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="mo_diem_danh" label="Tuần mở điểm danh">
            <InputNumber min={1} className="w-full"></InputNumber>
          </Form.Item>
          <Form.Item name="dong_diem_danh" label="Tuần đóng điểm danh">
            <InputNumber min={1} className="w-full"></InputNumber>
          </Form.Item>
          <Form.Item name="dong_tre" label="Số tuần đóng trễ điểm danh">
            <InputNumber min={0} className="w-full"></InputNumber>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button className="mx-1" onClick={closeModal}>
                Hủy
              </Button>
              <Button
                loading={loading}
                className="mx-1"
                type="primary"
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DongDiemDanhDialog;
