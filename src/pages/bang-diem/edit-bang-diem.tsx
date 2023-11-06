import { FC, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload, notification } from "antd";
import { getAuthUser } from "@/stores/features/auth";
import { useAppSelector } from "@/stores/hook";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import { UploadOutlined } from "@ant-design/icons";
import bangDiemApi from "@/api/bangDiem/bangDiem.api";
import { SiMicrosoftexcel } from "react-icons/si";
import lopHocApi from "@/api/lop/lopHoc.api";
import { UploadFile } from "antd/es/upload";
import type { UploadProps } from "antd";
import { useTranslation } from "react-i18next";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";
import dayjs from "dayjs";
interface Props {
  showModalEdit: boolean;
  setShowModalEdit: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  data?: any;
}
const { Option } = Select;

const BangDiemEditor: FC<Props> = ({
  showModalEdit,
  setShowModalEdit,
  setKeyRender,
  data
}) => {
  const { items: dotThi } = useLoaiLopThi();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState(data?.loai);
  const authUser = useAppSelector(getAuthUser);
  const [kiHoc, setKihoc] = useState<any | string[]>([]);
  const { t } = useTranslation("danh-sach-bang-diem");
  const [lopThiGV, setLopThiGV] = useState();
  const [loading, setLoading] = useState(false);
  const [kiHocSelected, setKiHocSelected] = useState<string>();
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [callnofi, contextholder] = notification.useNotification();

  const handleChange = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };

  const getLopGV = async () => {
    try {
      const res = await lopHocApi.lopGiaoVien({
        ...authUser,
        ki_hoc: kiHocSelected || data?.ki_hoc
      });
      setLopThiGV(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data.map((x) => ({ label: x, value: x })));
      }
    };
    getKyHoc();
  }, []);

  useEffect(() => {
    if (selectedValue === "nhan_dien") return;
    getLopGV();
  }, [kiHocSelected, authUser, data, selectedValue]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setSelectedValue(data.loai);
    }
  }, [data, showModalEdit]);

  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
  };
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList
  };
  const onFinish = async (value: any) => {
    setLoading(true);
    if (
      value.file != null &&
      value.file != undefined &&
      value.file instanceof Object
    ) {
      if (value.file.fileList.length > 0) {
        value.file = value.file.fileList[0].originFileObj;
      }
    }
    if (value.loai == "nhan_dien") {
      try {
        await bangDiemApi.update({
          ...data,
          ...value
          // loai: value.loai == 1 ? "nhan_dien" : "",
        });
        callnofi.success({
          message: "Thành Công",
          description: "Chỉnh sửa môn học thành công!"
        });
        setShowModalEdit(false);
        form.resetFields();
        setKeyRender(Math.random());
      } catch (error: any) {
        callnofi.error({
          message: "Thất bại",
          description: error.response.data.message
            ? error.response.data.message
            : "Thêm mới môn học thất bại!"
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await bangDiemApi.updateExcel({
          ...data,
          ...value,
          // loai: value.loai == 2 ? "nhap_tay" : "",
          user: authUser
        });
        callnofi.success({
          message: "Thành Công",
          description: "Chỉnh sửa môn học thành công!"
        });

        setShowModalEdit(false);
        form.resetFields();
        setKeyRender(Math.random());
      } catch (error: any) {
        console.log(error);
        callnofi.error({
          message: "Thất bại",
          description: error.response.data.message
            ? error.response.data.message
            : "Thêm mới môn học thất bại!"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  const onCancel = () => {
    setShowModalEdit(false);
    form.resetFields();
  };

  return (
    <>
      {contextholder}
      <Modal
        centered
        className="relative"
        open={showModalEdit}
        onCancel={onCancel}
        footer={null}
      >
        <div className="model-container">
          <div className="create-icon">
            <div>
              <SiMicrosoftexcel />
            </div>
          </div>
          <div className="modal-title-wapper">
            <p className="modal-title">{t("title.edit")}</p>
            <p>{t("sub_title.edit")}</p>
          </div>
          <Form
            layout="vertical"
            className="base-form"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="loai"
              label="Loại"
              rules={[{ required: true, message: "Loại không được để trống" }]}
            >
              <Select disabled={true} onChange={setSelectedValue}>
                <Select.Option value="nhan_dien">
                  Nhập tự Động File PDF
                </Select.Option>
                <Select.Option value="nhap_tay">
                  Nhập tay File EXCEL
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Kì học"
              name="ki_hoc"
              rules={[
                { required: true, message: "Kì học không được để trống" }
              ]}
              validateStatus={validateForm(
                errorMessage?.errors?.ki_hoc?.length
              )}
              help={
                errorMessage?.errors?.ki_hoc
                  ? errorMessage?.errors?.ki_hoc[0]
                  : undefined
              }
            >
              <Select
                disabled={true}
                onChange={setKiHocSelected}
                options={kiHoc}
              ></Select>
            </Form.Item>
            <Form.Item
              name="ki_thi"
              initialValue="GK"
              label="Kì Thi"
              rules={[{ required: true }]}
            >
              <Select disabled={true}>
                {dotThi.map((x) => (
                  <Select.Option value={x.value} key={x.value}>
                    {x.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {selectedValue == "nhan_dien" ? (
              <>
                <Form.Item
                  label="Mã học phần"
                  name="ma_hp"
                  rules={[{ required: true, message: " " }]}
                  validateStatus={validateForm(
                    errorMessage?.errors?.ma_hp?.length
                  )}
                  help={
                    errorMessage?.errors?.ma_hp
                      ? errorMessage?.errors?.ma_hp[0]
                      : undefined
                  }
                >
                  <Input
                    disabled={true}
                    onChange={() => handleChange("ma_hp")}
                  ></Input>
                </Form.Item>
                <Form.Item
                  label="Tên học phần"
                  name="ten_hp"
                  rules={[
                    {
                      required: true,
                      message: "Tên học phần không được để trống"
                    }
                  ]}
                  validateStatus={validateForm(
                    errorMessage?.errors?.ten_hp?.length
                  )}
                  help={
                    errorMessage?.errors?.ten_hp
                      ? errorMessage?.errors?.ten_hp[0]
                      : undefined
                  }
                >
                  <Input
                    className="bg-white"
                    onChange={() => handleChange("ten_hp")}
                  ></Input>
                </Form.Item>
              </>
            ) : (
              <Form.Item name="lop_hoc" label="Lớp học">
                <Select
                  showSearch
                  disabled={
                    data?.isPhucKhao ||
                    dayjs().format("YY-D-M").toString() >
                      data?.ngay_ket_thuc_phuc_khao
                  }
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {renderOption(lopThiGV)}
                </Select>
              </Form.Item>
            )}
            <Form.Item label="Ghi chú" name="ghi_chu">
              <Input.TextArea className="bg-white"></Input.TextArea>
            </Form.Item>
            {selectedValue == "nhan_dien" ? (
              <Form.Item
                name="file"
                label="Tải tập tin PDF"
                rules={[
                  {
                    required: false
                  }
                ]}
              >
                <Upload
                  disabled={
                    data?.isPhucKhao ||
                    dayjs().format("YY-D-M").toString() >
                      data?.ngay_ket_thuc_phuc_khao
                  }
                  name="file"
                  accept=".pdf"
                  {...props}
                  style={{ width: "100%" }}
                >
                  <Button block icon={<UploadOutlined />}>
                    {t("action.select_file")}
                  </Button>
                </Upload>
              </Form.Item>
            ) : selectedValue == "nhap_tay" ? (
              <Form.Item name="file" label="Tải tập tin Excel">
                <Upload
                  disabled={
                    data?.isPhucKhao ||
                    dayjs().format("YY-D-M").toString() >
                      data?.ngay_ket_thuc_phuc_khao
                  }
                  name="file"
                  accept=".xls, .xlsx"
                  {...props}
                  style={{ width: "100%" }}
                >
                  <Button block icon={<UploadOutlined />}>
                    {t("action.select_file")}
                  </Button>
                </Upload>
              </Form.Item>
            ) : (
              <></>
            )}
            <Form.Item>
              <div className="flex">
                <Button onClick={onCancel} className="mx-1" block>
                  Hủy
                </Button>
                <Button
                  htmlType="submit"
                  className="mx-1"
                  type="primary"
                  block
                  loading={loading}
                >
                  Xác nhận
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default BangDiemEditor;
const renderOption = (data: any) => {
  if (!data) return <></>;
  return (
    <>
      {data.map((item: any) => {
        return (
          <Option key={item.id} value={item.id} label={item.ma}>
            <p>{item.ma}</p>
            <p>{item.ki_hoc}</p>
          </Option>
        );
      })}
    </>
  );
};
