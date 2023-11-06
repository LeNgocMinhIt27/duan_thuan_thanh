import { FC, useCallback, useState } from "react";
import { Form, Modal, notification } from "antd";

import { AxiosError } from "axios";
import ColorButton from "@/components/Button";
import { Laravel400ErrorResponse } from "@/interface/axios/laravel";
import { PhucKhao } from "@/interface/phucKhao";
import { SiMicrosoftexcel } from "react-icons/si";
import { dealsWith } from "@/api/axios/error-handle";
import { getPrefix } from "@/constant";
import phucKhaoSinhVienApi from "@/api/phucKhao/phucKhaoSinhVien.api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  isEdit: boolean;
  data?: any;
  dataLop?: any;
  setEdit: (value: boolean) => void;
}
const EditorDialog: FC<Props> = ({
  showModal,
  setShowModal,
  data,
  setEdit
}) => {
  const { t } = useTranslation("phuc-khao");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dataPhucKhao] = useState<Partial<PhucKhao>>({
    sinh_vien_id: data?.sinh_vien_id,
    lop_id: data?.lop_id,
    lop_thi_id: data?.lop_thi_id,
    ki_hoc: data?.ki_hoc,
    trang_thai: "chua_thanh_toan"
  });

  const onFinish = async () => {
    setLoading(true);
    try {
      const res = await phucKhaoSinhVienApi.create({ ...dataPhucKhao });
      api.success({
        message: "Thành công",
        description: "Xác nhận phúc khảo"
      });
      navigate(`${getPrefix()}/qr-code/${res.data.data.id}`);
      setShowModal(false);
    } catch (err: any) {
      const is_handle = handleError(err);
      if (!is_handle) {
        api.error({
          message: t("message.error_add"),
          description: t("message.error_desc_add")
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleError = useCallback(
    (err: any) => {
      return dealsWith({
        "400": (e: any) => {
          const error = e as AxiosError<Laravel400ErrorResponse>;
          if (error.response) {
            api.error({
              message: t("message.error_add"),
              description: error.response.data.message
            });
          }
        }
      })(err);
    },
    [api, t]
  );
  const handleCancel = (e: any) => {
    e.stopPropagation();
    setShowModal(false);
    setEdit(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        centered
        footer={<></>}
        className="relative"
        open={showModal}
        onCancel={handleCancel}
      >
        <div className="create-icon">
          <div>
            <SiMicrosoftexcel />
          </div>
        </div>
        <div className="modal-title-wapper">
          <p className="modal-title">Xác nhận phúc khảo</p>
          <p className="modal-title">Tiếp tục vào trang thanh toán</p>
        </div>
        <Form
          initialValues={{ role_code: "student" }}
          layout="vertical"
          className="base-form"
          onFinish={onFinish}
          form={form}
        >
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
                Đồng ý
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditorDialog;
