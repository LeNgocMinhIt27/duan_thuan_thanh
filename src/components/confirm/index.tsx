import { Button, Modal, Space, Typography } from "antd";
import { EDIT_TYPE, EDIT_TYPE_TYPE } from "@/constant";
import {
  ReactElement,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import { LiaCheckCircleSolid } from "react-icons/lia";
import { MdErrorOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface Props {
  title: string | ReactElement;
  text: string | ReactElement;
  icon?: ReactElement;
  noText?: string;
  yesText?: string;
  type?: EDIT_TYPE_TYPE;
  color?: any;
  classNameIcon?: string;
}
export interface ConfirmHandle {
  open: (_: Props) => Promise<boolean>;
}

const DEFAULT_PROP: { [key in EDIT_TYPE_TYPE]?: any } = {
  [EDIT_TYPE.DELETE]: {
    icon: <MdErrorOutline />,
    color: "#FF5A5A",
    yesText: "Xoá",
    classNameIcon: "delete-icon"
  }
};
const { Title, Text } = Typography;
const ConfirmDialog = forwardRef((_: unknown, ref: Ref<ConfirmHandle>) => {
  const { t } = useTranslation("default");
  const [show, setShow] = useState(false);
  const promise = useRef<{ resolve: any; reject: any }>({
    resolve: null,
    reject: null
  });
  const [option, setOption] = useState<Partial<Props>>({
    title: "",
    text: "",
    color: "#0747A6"
  });
  useImperativeHandle(ref, () => ({
    open
  }));
  function open(options: Props) {
    let temp: Partial<Props> = {};
    if (options.type) {
      temp = DEFAULT_PROP[options.type] || {};
    }
    temp = Object.assign(
      { icon: <LiaCheckCircleSolid />, color: "#0747A6" },
      temp,
      options
    );
    setOption(temp);
    setShow(true);

    return new Promise<any>((resolve, reject) => {
      promise.current = {
        resolve,
        reject
      };
    });
  }
  function close() {
    setShow(false);
    promise.current = {
      resolve: null,
      reject: null
    };
  }
  function agree() {
    if (promise.current && promise.current.resolve)
      promise.current.resolve(true);
    close();
  }
  function cancel() {
    if (promise.current && promise.current.resolve)
      promise.current.resolve(false);
    close();
  }
  return (
    <Modal open={show} closeIcon={null} footer={null} width={400} centered>
      <Space direction="vertical">
        <div className={["confirm-icon", option.classNameIcon].join(" ")}>
          <div>{option.icon}</div>
        </div>
        <Space.Compact direction="vertical">
          <Title level={5}>{option.title}</Title>
          <Text>{option.text}</Text>
        </Space.Compact>
        <Space.Compact block>
          <Button
            onClick={cancel}
            style={{ width: "50%", height: "44px", marginRight: "12px" }}
          >
            {option.noText || t("actions.no", "Huỷ")}
          </Button>
          <Button
            onClick={agree}
            style={{
              width: "50%",
              height: "44px",
              background: option.color,
              color: "#ffff"
            }}
          >
            {option.yesText || t("actions.apply", "Xác nhận")}{" "}
          </Button>
        </Space.Compact>
      </Space>
    </Modal>
  );
});

export default ConfirmDialog;
