import { FC, useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, Select, notification } from "antd";

import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { Lop } from "@/interface/lop";
import { SiMicrosoftexcel } from "react-icons/si";
import { SinhVien } from "@/interface/sinhVien";
import { convertErrorAxios } from "@/api/axios";
import lopHocApi from "@/api/lop/lopHoc.api";
import sinhVienApi from "@/api/user/sinhvien.api";
import { useTranslation } from "react-i18next";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  isEdit: boolean;
  classId: number;
  data?: any;
  setEdit: (value: boolean) => void;
  existStudent: any;
  lopAll?: Lop;
  lop: Lop;
}
const { Option } = Select;
const EditorStudentDialog: FC<Props> = ({
  showModal,
  setShowModal,
  setKeyRender,
  isEdit,
  data,
  existStudent,
  setEdit,
  classId,
  lop,
  lopAll
}) => {
  const { t } = useTranslation("sinh-vien-lop");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [sinhVienList, setSinhVienList] = useState<SinhVien[]>([]);
  const [otherClass, setOtherClass] = useState<any>([]);
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [param, setParam] = useState<any>({
    page: 1,
    itemsPerPage: 10,
    paginate: true,
    sortModel: [],
    search: ""
  });
  const getOtherCLass = (data: any) => {
    if (!data?.children) return;
    setOtherClass(() =>
      data.children.filter((itemA: Lop) => lop.id !== itemA.id)
    );
  };

  const getSinhVien = async (existStudent: SinhVien[]) => {
    try {
      const res = await sinhVienApi.filter(param);
      const datafilter = res.data.list.filter(
        (itemA: SinhVien) =>
          !existStudent.some((itemB: SinhVien) => itemA.id === itemB.id)
      );

      setSinhVienList(datafilter);
    } catch (error) {
      api.error({
        message: "Lỗi khi lấy dữ liệu sinh viên",
        description:
          "Đã xảy ra lỗi trong quá trình lấy dữ liệu giảng viên, chúng tôi sẽ sớm khắc phục, vui lòng quay lại sau!"
      });
    }
  };

  const handleChange = (value: string) => {
    setParam({
      page: 1,
      itemsPerPage: 10,
      paginate: true,
      sortModel: [],
      search: value
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    if (isEdit) {
      try {
        await lopHocApi.updateSV({
          id: classId,
          sinh_viens: values.sinh_viens.value,
          stt: values.stt,
          nhom: values.nhom
        });
        api.success({
          message: t("message.success_edit"),
          description: t("message.success_desc_edit")
        });
        setShowModal(false);
        form.resetFields();
        setKeyRender(Math.random());
        setEdit(false);
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
        await lopHocApi.addSV({ id: classId, ...values, children: otherClass });
        api.success({
          message: t("message.success_create"),
          description: t("message.success_desc_create")
        });
        setShowModal(false);
        form.resetFields();
        setKeyRender(Math.random());
        setEdit(false);
        setErrorMessage(null);
      } catch (err: any) {
        const res = convertErrorAxios<LaravelValidationResponse>(err);
        setErrorMessage(err.data);
        if (res.type === "axios-error") {
          const { response } = res.error;
          if (response) setErrorMessage(response.data);
          api.error({
            message: t("message.error_create"),
            description: response?.data.errors.stt
              ? response?.data.errors.stt
              : t("message.error_desc_create")
          });
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
    if (isEdit && data) {
      form.setFieldsValue({
        sinh_viens: { value: data.id, label: data.name },
        stt: data.pivot.stt,
        nhom: data.pivot.nhom
      });
    }
  }, [form, data, isEdit]);
  useEffect(() => {
    getOtherCLass(lopAll);
  }, [lop.id]);
  useEffect(() => {
    getSinhVien(existStudent);
  }, [param.search, data]);

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
            label="STT"
            name="stt"
            // rules={[{ required: true, message: t("required.stt") }]}
            validateStatus={validateForm(errorMessage?.errors?.stt?.length)}
            help={
              errorMessage?.errors?.stt
                ? errorMessage?.errors?.stt[0]
                : undefined
            }
          >
            <InputNumber className="w-full bg-white" min={1}></InputNumber>
          </Form.Item>
          <Form.Item
            label="Sinh viên"
            name="sinh_viens"
            rules={[{ required: true, message: t("required.sinh_vien") }]}
            validateStatus={validateForm(
              errorMessage?.errors?.sinh_viens?.length
            )}
            help={
              errorMessage?.errors?.sinh_viens
                ? errorMessage?.errors?.sinh_viens[0]
                : undefined
            }
          >
            <Select
              disabled={isEdit}
              showSearch
              onSearch={handleChange}
              filterOption={false}
            >
              {renderOption(sinhVienList)}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nhóm"
            name="nhom"
            rules={[{ required: true, message: t("required.nhom") }]}
          >
            <Input className="w-full bg-white"></Input>
          </Form.Item>
          <Form.Item className="absolute bottom-0 right-0 left-0 px-6 pt-2 bg-white">
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
                {isEdit ? t("action.edit") : t("action.create_new")}
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditorStudentDialog;
const renderOption = (data: SinhVien[]) => {
  if (!data) return <></>;
  return (
    <>
      {data.map((item) => (
        <Option key={item.id} value={item.id} label={`${item.name}`}>
          <p>{item.name}</p>
          <p>{item.mssv}</p>
        </Option>
      ))}
    </>
  );
};
