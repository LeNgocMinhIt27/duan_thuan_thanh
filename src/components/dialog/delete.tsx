import { Button, Modal, notification } from "antd";

import { MdErrorOutline } from "react-icons/md";
import react from "react";
import { useTranslation } from "react-i18next";

interface DeleteProps {
  title: string;
  name?: string;
  openState: boolean;
  keyRender: number;
  setKeyRender: (key: number) => void;
  closeModalFunction: (type?: string) => void;
  onDeleteItem: () => void;
}

const DeleteDialog: react.FC<DeleteProps> = ({
  title,
  name,
  openState,
  keyRender,
  setKeyRender,
  onDeleteItem,
  closeModalFunction
}: DeleteProps) => {
  const { t } = useTranslation("default");
  const [api, contextHolder] = notification.useNotification();

  const onClose = () => {
    closeModalFunction("delete");
  };

  const onFinish = async () => {
    onDeleteItem();
    api.success({
      message: "Thành công",
      description: `Xóa ${title} thành công`
    });
    onClose();
    setKeyRender(keyRender + 1);
  };

  return (
    <>
      {contextHolder}
      <Modal centered open={openState} onCancel={onClose} footer={null}>
        <div>
          <div className="create-icon delete-icon">
            <div>
              <MdErrorOutline />
            </div>
          </div>
          <div className="modal-title-wapper">
            <p className="modal-title">{title}</p>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "1rem" }}>
            Bạn có chắc chắn muốn xóa {title + " "}
            <span style={{ color: "red" }}>{name}</span> không? Hành động này
            không thể được hoàn tác.
          </p>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "49%", marginRight: "0.4rem" }}>
            <Button onClick={onClose} block size={"large"}>
              {t("actions.cancel")}
            </Button>
          </div>
          <div style={{ width: "49%", marginLeft: "0.4rem" }}>
            <Button
              type="primary"
              danger
              onClick={onFinish}
              block
              size={"large"}
            >
              {t("actions.delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteDialog;
