import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Select, Switch, notification } from "antd";

import ColorButton from "@/components/Button";
import { GiaoVien } from "@/interface/giaoVien";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import configApi from "@/api/config.api";
import { convertErrorAxios } from "@/api/axios";
import giaoVienApi from "@/api/user/giaoVien.api";
import kyHocApi from "@/api/kiHoc/kiHoc.api";
import lopHocApi from "@/api/lop/lopHoc.api";
import { useTranslation } from "react-i18next";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  isEdit: boolean;
  data?: any;
  setEdit: (value: boolean) => void;
}
const { Option } = Select;
const EditorDialog: FC<Props> = ({
  showModal,
  setShowModal,
  setKeyRender,
  isEdit,
  data,
  setEdit
}) => {
  const { t } = useTranslation("lop");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIschecked] = useState(data);
  const [giaoVienList, setGiaoVenList] = useState<GiaoVien[]>([]);
  const [kiHoc, setKiHoc] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);

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
    if (isEdit) {
      try {
        await lopHocApi.edit({ ...data, ...values });
        api.success({
          message: t("message.success_edit"),
          description: t("message.success_desc_edit")
        });
        setShowModal(false);
        form.resetFields();
        setKeyRender(Math.random());
      } catch (err: any) {
        const res = convertErrorAxios<LaravelValidationResponse>(err);
        setErrorMessage(err.data);
        if (res.type === "axios-error") {
          api.error({
            message: t("message.error_edit"),
            description: t("message.error_desc_edit")
          });
          const { response } = res.error;
          if (response) setErrorMessage(response.data);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await lopHocApi.create(values);
        api.success({
          message: t("message.success_add"),
          description: t("message.success_desc_add")
        });
        setShowModal(false);
        form.resetFields();
        setKeyRender(Math.random());
      } catch (err: any) {
        const res = convertErrorAxios<LaravelValidationResponse>(err);
        setErrorMessage(err.data);
        if (res.type === "axios-error") {
          api.error({
            message: t("message.error_add"),
            description: t("message.error_desc_add")
          });
          const { response } = res.error;
          if (response) setErrorMessage(response.data);
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const validateForm = (value: any) => {
    if (errorMessage && value) {
      return "error";
    }
  };
  const handleCancel = () => {
    setShowModal(false);
    setEdit(false);
    form.resetFields();
    setErrorMessage(null);
  };

  useEffect(() => {
    setIschecked(data?.is_dai_cuong);
  }, [data]);
  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        ...data,
        giao_viens: data.giao_viens
          ? data.giao_viens.map((item: GiaoVien) => item.id)
          : []
      });
    }
  }, [form, data, isEdit]);

  useEffect(() => {
    const getGiaoVien = async () => {
      try {
        const res = await giaoVienApi.cache();
        if (res.data && res.data.length > 0) setGiaoVenList(res.data);
      } catch (error) {
        api.error({
          message: "Lỗi khi lấy dữ liệu giảng viên",
          description:
            "Đã xảy ra lỗi trong quá trình lấy dữ liệu giảng viên, chúng tôi sẽ sớm khắc phục, vui lòng quay lại sau!"
        });
      }
    };

    const getKyHoc = async () => {
      try {
        const res = await kyHocApi.list();
        if (res.data && res.data.length > 0) setKiHoc(res.data);
      } catch (error) {
        api.error({
          message: "Lỗi khi lấy dữ liệu giảng viên",
          description:
            "Đã xảy ra lỗi trong quá trình lấy dữ liệu giảng viên, chúng tôi sẽ sớm khắc phục, vui lòng quay lại sau!"
        });
      }
    };
    getGiaoVien();
    getKyHoc();
  }, [api]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kihocs = await configApi.getKiHocs();
        setKiHoc(kihocs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
        <div className="model-container">
          <div className="model-icon create-icon">
            <div>
              <SiMicrosoftexcel />
            </div>
          </div>
          <div className="modal-title-wapper ">
            <p className="modal-title">
              {isEdit ? t("title.edit") : t("title.create_new")}
            </p>
            <p>{isEdit ? t("sub_title.edit") : t("sub_title.create_new")}</p>
          </div>
          <Form
            initialValues={{ role_code: "student" }}
            layout="vertical"
            className="base-form"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="Mã lớp"
              name="ma"
              rules={[{ required: true, message: t("required.ma") }]}
              validateStatus={validateForm(errorMessage?.errors?.ma?.length)}
              help={
                errorMessage?.errors?.ma
                  ? errorMessage?.errors?.ma[0]
                  : undefined
              }
            >
              <Input onChange={() => handleChange("ma")}></Input>
            </Form.Item>
            <Form.Item label="Mã lớp kèm" name="ma_kem">
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="Mã học phần"
              name="ma_hp"
              rules={[{ required: true, message: t("required.ma_hp") }]}
              validateStatus={validateForm(errorMessage?.errors?.ma_hp?.length)}
              help={
                errorMessage?.errors?.ma_hp
                  ? errorMessage?.errors?.ma_hp[0]
                  : undefined
              }
            >
              <Input onChange={() => handleChange("ma_hp")}></Input>
            </Form.Item>
            <Form.Item
              label="Tên học phần"
              name="ten_hp"
              rules={[{ required: true, message: t("required.ten_hp") }]}
              validateStatus={validateForm(
                errorMessage?.errors?.ten_hp?.length
              )}
              help={
                errorMessage?.errors?.ten_hp
                  ? errorMessage?.errors?.ten_hp[0]
                  : undefined
              }
            >
              <Input onChange={() => handleChange("ten_hp")}></Input>
            </Form.Item>
            <Form.Item label="Phòng" name="phong">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Loại" name="loai">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Tuần học" name="tuan_hoc">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Đại cương" name="is_dai_cuong">
              <Switch
                checked={isChecked}
                onChange={() => {
                  setIschecked(!isChecked);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Kì học"
              name="ki_hoc"
              rules={[{ required: true, message: t("required.ki_hoc") }]}
            >
              <Select
                onChange={(selectedValues) => {
                  handleChange(selectedValues);
                }}
              >
                {renderOptionAdmin(kiHoc)}
              </Select>
            </Form.Item>
            <Form.Item
              label="Giảng viên"
              name="giao_viens"
              rules={[{ required: true, message: t("required.giao_viens") }]}
              validateStatus={validateForm(
                errorMessage?.errors?.giao_viens?.length
              )}
              help={
                errorMessage?.errors?.giao_viens
                  ? errorMessage?.errors?.giao_viens[0]
                  : undefined
              }
            >
              <Select
                mode="multiple"
                onChange={() => handleChange("giao_viens")}
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  const label = String(option?.label).toLowerCase();
                  return label?.includes(searchText);
                }}
              >
                {renderOption(giaoVienList)}
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="ghi_chu">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
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
                  {t("action.accept")}
                </ColorButton>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditorDialog;
const renderOption = (data: GiaoVien[]) => {
  if (!Array.isArray(data)) return <></>;
  if (!data || !data.length) return <></>;
  return (
    <>
      {data.map((item) => (
        <Option
          key={item.id}
          value={item.id}
          label={`${item.name} (${item.email})`}
        >
          <p>{item.name}</p>
          <p>{item.email}</p>
        </Option>
      ))}
    </>
  );
};
const renderOptionAdmin = (kihoc: string[]) => {
  if (!Array.isArray(kihoc)) return <></>;
  if (!kihoc || !kihoc.length) return <></>;
  return (
    <>
      {kihoc.map((item) => {
        return (
          <Option key={item} value={item} label={item}>
            {item}
          </Option>
        );
      })}
    </>
  );
};
