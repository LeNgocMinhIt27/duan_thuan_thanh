import { FC, useEffect, useState } from "react";
import { Form, Input, notification } from "antd";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { convertErrorAxios } from "@/api/axios";
import { Modal, Select } from "antd/lib";
import { useTranslation } from "react-i18next";
import { SiMicrosoftexcel } from "react-icons/si";
import ColorButton from "@/components/Button";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import baoLoiSvApi from "@/api/baoLoiSinhVien/baoLoiSv.api";
import lopThiSinhVienApi from "@/api/baoLoiSinhVien/lopThiSinhVien.api";
import lopHocErrorApi from "@/api/baoLoiSinhVien/lopHocError.api";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setKeyRender?: (value: number) => void;
  isEdit: boolean;
  data?: any;

  setEdit: (value: boolean) => void;
}
const FormAddNotifyError: FC<Props> = ({
  showModal,
  setShowModal,
  setKeyRender,
  setEdit
}) => {
  const [hocKiData, setHocKiData] = useState<any[]>([]);
  const [lopData, setLopData] = useState<any[]>();
  const [lopThiData, setLopThiData] = useState<any[]>();
  const { t } = useTranslation("bao-loi");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);

  const [form] = Form.useForm();

  const handleChange = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const postData = {
        ki_hoc: values.baoLoi.ki_hoc,
        lop_id: values.baoLoi.lop_id,
        lop_thi_id: values.baoLoi.lop_thi_id,
        tieu_de: values.baoLoi.tieu_de,
        ly_do: values.baoLoi.loai,
        ghi_chu: values.baoLoi.ghi_chu
      };
      await baoLoiSvApi.create(postData);
      api.success({
        message: t("message.success_uploadForm"),
        description: t("message.success_desc_uploadForm")
      });
      setShowModal(false);
      form.resetFields();
      setKeyRender && setKeyRender(Math.random());
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_uploadForm"),
          description: t("message.error_desc_uploadForm")
        });
        const { response } = res.error;
        if (response) setErrorMessage(response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
  };

  const [kiHocDachon, setKiHocDaChon] = useState("");
  const [lopHocDachon, setLopHocDaChon] = useState("");
  const [lopThiDachon, setLopThiDaChon] = useState("");

  const handleKiHocChange = (value: any) => {
    setKiHocDaChon(value);
  };

  const handleClassChange = (value: any) => {
    setLopHocDaChon(value);
  };

  const handleLopThiChange = (value: any) => {
    setLopThiDaChon(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await kiHocApi.list();
        setHocKiData(response.data);
      } catch (error) {
        console.error("API call failed:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataLop = async () => {
      if (kiHocDachon) {
        try {
          const response = await lopThiSinhVienApi.list();
          setLopData(response.data);
        } catch (error) {
          console.error("API call failed:", error);
        }
      }
    };
    fetchDataLop();
  }, [kiHocDachon]);

  const filteredClasses = lopData?.filter(
    (item: any) => item?.ki_hoc === kiHocDachon
  );

  useEffect(() => {
    if (lopHocDachon) {
      const fetchDataLopThi = async () => {
        try {
          const response = await lopHocErrorApi.getListLopThi();
          setLopThiData(response.data.list);
        } catch (error) {
          console.error("API call failed:", error);
        }
      };
      fetchDataLopThi();
    }
  }, [lopHocDachon, kiHocDachon]);

  const filteredLopThi = lopThiData?.filter(
    (item: any) =>
      item?.lop?.ki_hoc === kiHocDachon && item?.lop_id === lopHocDachon
  );
  const handleCancel = () => {
    setShowModal(false);
    setEdit(false);
    form.resetFields();
    setErrorMessage(null);
  };
  const loai = [
    { key: "option1", value: "Chưa có điểm" },
    { key: "option2", value: "Sai điểm" },
    { key: "option3", value: "Khác" }
  ];
  return (
    <>
      {contextHolder}
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
          {...layout}
          initialValues={{ role_code: "student" }}
          name="error-messages"
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name={["baoLoi", "ki_hoc"]}
            label="Kì học"
            rules={[{ required: true }]}
            validateStatus={validateForm(errorMessage?.errors?.ki_hoc?.length)}
            help={
              errorMessage?.errors?.ki_hoc
                ? errorMessage?.errors?.ki_hoc[0]
                : undefined
            }
          >
            <Select
              allowClear
              placeholder="Chọn kì học"
              style={{ width: "100%" }}
              onChange={handleKiHocChange}
              value={kiHocDachon}
              showSearch
              filterOption={(inputValue, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            >
              {hocKiData?.map((i) => (
                <Select.Option key={i} value={i}>
                  {i}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["baoLoi", "lop_id"]}
            label="Lớp"
            rules={[{ required: true }]}
            validateStatus={validateForm(errorMessage?.errors?.lop_id?.length)}
            help={
              errorMessage?.errors?.lop_id
                ? errorMessage?.errors?.lop_id[0]
                : undefined
            }
          >
            <Select
              allowClear
              placeholder="Chọn lớp học"
              style={{ width: "100%" }}
              onChange={handleClassChange}
              value={lopHocDachon}
              showSearch
              filterOption={(inputValue, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            >
              {filteredClasses?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item?.ma_hp} - {item?.ten_hp} - {item?.ma}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={["baoLoi", "lop_thi_id"]}
            label="Lớp thi"
            rules={[{ required: true }]}
            validateStatus={validateForm(
              errorMessage?.errors?.lop_thi_id?.length
            )}
            help={
              errorMessage?.errors?.lop_thi_id
                ? errorMessage?.errors?.lop_thi_id[0]
                : undefined
            }
          >
            <Select
              allowClear
              placeholder="Chọn lớp thi"
              style={{ width: "100%" }}
              onChange={handleLopThiChange}
              value={lopThiDachon}
              showSearch
              filterOption={(inputValue, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            >
              {filteredLopThi?.map((item) => (
                <Select.Option key={item.id} value={`${item?.id}`}>
                  {item?.lop?.ma_hp} - {item?.lop?.ten_hp} ({item?.ma})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["baoLoi", "loai"]}
            label="Loại"
            rules={[{ required: true }]}
            // validateStatus={validateForm(errorMessage?.errors?.lop_id?.length)}
            // help={
            //   errorMessage?.errors?.lop_id
            //     ? errorMessage?.errors?.lop_id[0]
            //     : undefined
            // }
          >
            <Select
              allowClear
              placeholder="Loại"
              style={{ width: "100%" }}
              onChange={handleChange}
              showSearch
              filterOption={(inputValue, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            >
              {loai?.map((item) => (
                <Select.Option key={item.key} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["baoLoi", "tieu_de"]}
            label="Lý do"
            rules={[{ required: true }]}
            validateStatus={validateForm(errorMessage?.errors?.tieu_de?.length)}
            help={
              errorMessage?.errors?.tieu_de
                ? errorMessage?.errors?.tieu_de[0]
                : undefined
            }
          >
            <Input />
          </Form.Item>
          <Form.Item name={["baoLoi", "ghi_chu"]} label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-between gap-4">
              <ColorButton
                block
                className="mr-4"
                onClick={() => handleCancel()}
              >
                Huỷ
              </ColorButton>
              <ColorButton
                block
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                Thêm
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FormAddNotifyError;
