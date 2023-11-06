import { FC, useState } from "react";
import { Modal, notification } from "antd";

import ColorButton from "../Button";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface Props {
  openModal: boolean;
  name: string | undefined;
  closeModal: (value: boolean) => void;
  setKeyRender?: (value: number) => void;
  apiDelete: any;
  translation: string;
}
const DeleteDialog: FC<Props> = (props) => {
  const { openModal, closeModal, name, setKeyRender, apiDelete, translation } =
    props;
  const { t } = useTranslation(translation);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const cancel = () => {
    closeModal(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiDelete();
      api.success({
        message: t("message.success_delete"),
        description: t("message.success_desc_delete")
      });
    } catch (error: any) {
      api.error({
        message: t("message.error_delete"),
        description: error.response.data.message
          ? error.response.data.message
          : t("message.error_desc_delete")
      });
    } finally {
      setKeyRender && setKeyRender(Math.random());
      setLoading(false);
      closeModal(false);
    }
  };
  return (
    <>
      {contextHolder}
      <Modal centered open={openModal} onCancel={cancel} footer={<></>}>
        <div className="delete-icon">
          <div>
            <ExclamationCircleFilled />
          </div>
        </div>

        <div className="modal-title-wapper">
          <p className="modal-title">{t("title.delete")}</p>
          <p className="modal-suptitle">
            Bạn có chắc muốn xoá <b> {name} </b> này không? Hành động này không
            thể được hoàn tác{" "}
            {name == "Đơn phúc khảo"
              ? ". Khoản tiền phúc khảo nếu đã thanh toán sẽ không được hoàn trả"
              : ""}
            .
          </p>
        </div>
        <div className="flex justify-between gap-2 pt-4">
          <ColorButton block onClick={cancel}>
            {t("action.cancel")}
          </ColorButton>
          <ColorButton
            block
            onClick={handleDelete}
            loading={loading}
            type="primary"
          >
            {t("action.delete")}
          </ColorButton>
        </div>
      </Modal>
    </>
  );
};

export default DeleteDialog;
