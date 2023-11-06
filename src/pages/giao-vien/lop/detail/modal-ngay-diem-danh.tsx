import { Button, DatePicker, Form, Modal } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import Title from "antd/es/typography/Title";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SiMicrosoftexcel } from "react-icons/si";
interface DiemDanhGiaoVien {
  ngay_diem_danh: string | Dayjs;
}
interface Props {
  openModal: any;
  closeModal: any;
  setKeyRender: (value: number) => any;
  api?: (data: any) => Promise<any>;
  callnofi: NotificationInstance;
  data?: any;
  translation: string;
}
const TaoDiemDanh = ({
  openModal,
  translation,
  closeModal,
  api,
  callnofi,
  setKeyRender,
  data
}: Props) => {
  const { t } = useTranslation(translation);
  const [loading, setloading] = useState(false);

  const onFinish = async (value: DiemDanhGiaoVien) => {
    setloading(true);
    if (value.ngay_diem_danh) {
      value.ngay_diem_danh = dayjs(value.ngay_diem_danh).format("YYYY-MM-DD");
    }
    api &&
      (await api({ ...value, id: data?.["id"] })
        .then(() => {
          callnofi.success({
            message: "Thành Công",
            description: "Thêm ngày điểm danh thành công"
          });
        })
        .catch((err) => {
          callnofi.error({
            message: "Thất bại",
            description:
              err?.response.data.message || "Thêm ngày điểm danh thất bại"
          });
        })
        .finally(() => {
          setloading(false);
          closeModal();
          setKeyRender(Math.random());
        }));
  };

  return (
    <Modal
      open={openModal}
      onCancel={closeModal}
      centered
      destroyOnClose
      footer={<></>}
    >
      <div className="model-icon create-icon">
        <SiMicrosoftexcel />
      </div>
      <Title level={4}>Tạo mới ngày điểm danh</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          className="flex-1 mx-2"
          name="ngay_diem_danh"
          label="Ngày điểm danh"
        >
          <DatePicker className="w-full" allowClear format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end">
            <Button className="mx-1" onClick={closeModal}>
              {t("action.cancel")}
            </Button>
            <Button
              className="mx-1"
              loading={loading}
              type="primary"
              htmlType="submit"
            >
              {t("action.accept")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaoDiemDanh;
