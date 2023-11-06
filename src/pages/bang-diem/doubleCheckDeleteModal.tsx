import { FC, useState } from "react";
import { Modal, notification } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface Props {
  openModal: boolean;
  name: string | undefined;
  closeModal: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  apiDelete: () => void;
  translation: string;
}
const DoubleCheckDeleteModal: FC<Props> = (props) => {
  const { openModal, closeModal, name, setKeyRender, apiDelete, translation } =
    props;
  const { t } = useTranslation(translation);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [openComfirm, setOpenComfirm] = useState(false);
  const cancel = () => {
    closeModal(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    setOpenComfirm(false);
    try {
      await apiDelete();
      api.success({
        message: t("message.success_delete"),
        description: t("message.success_desc_delete")
      });
    } catch (error: any) {
      api.error({
        message: t("message.error_delete"),
        description: error.response?.data.message
          ? error.response?.data.message
          : t("message.error_desc_delete")
      });
    } finally {
      setKeyRender(Math.random());
      setLoading(false);
      closeModal(false);
    }
  };
  return (
    <div>
      {contextHolder}
      <Modal
        centered
        open={openModal}
        onCancel={cancel}
        onOk={() => {
          setOpenComfirm(true);
        }}
        confirmLoading={loading}
        cancelText={t("action.cancel")}
        okText={t("action.delete")}
      >
        <div className="delete-icon">
          <div>
            <ExclamationCircleFilled />
          </div>
        </div>

        <div className="modal-title-wapper">
          <p className="modal-title">{t("title.delete")}</p>
          <p className="modal-suptitle">
            Bạn có chắc muốn xoá <b> {name} </b> này không? Hành động này sẽ xoá
            hết dữ liệu điểm của môn.
          </p>
        </div>
      </Modal>
      <Modal
        centered
        open={openComfirm}
        cancelText={t("action.cancel")}
        okText={t("action.accept")}
        onOk={handleDelete}
        onCancel={() => setOpenComfirm(false)}
      >
        <div className="delete-icon">
          <div>
            <ExclamationCircleFilled />
          </div>
        </div>
        <div className="modal-title-wapper">
          <p className="modal-suptitle">
            Bạn có chắc muốn xoá ? Hành động này không thể được hoàn tác.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DoubleCheckDeleteModal;
