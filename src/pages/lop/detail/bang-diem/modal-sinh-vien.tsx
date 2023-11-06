import { FC, useEffect, useState } from "react";
import { Form, Modal, Select, notification, InputNumber } from "antd";

import ColorButton from "@/components/Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import { SinhVien } from "@/interface/sinhVien";
import { convertErrorAxios } from "@/api/axios";
import sinhVienApi from "@/api/user/sinhvien.api";
import { useTranslation } from "react-i18next";
import lopThiApi from "@/api/lop/lopThi.api";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  existStudent: any;
  data: any;
  lop_thi_id: string | number;
  getData: () => void;
  getSinhViens: () => void;
}
const { Option } = Select;
const AddStudent: FC<Props> = ({
  showModal,
  setShowModal,
  existStudent,
  data,
  lop_thi_id,
  getData,
  getSinhViens
}) => {
  const { t } = useTranslation("sinh-vien-lop");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [listId, setListId] = useState([]);
  const [sinhVienList, setSinhVienList] = useState<SinhVien[]>([]);
  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [param, setParam] = useState<any>({
    page: 1,
    itemsPerPage: 10,
    paginate: true,
    sortModel: [],
    search: ""
  });
  useEffect(() => {
    const listSinhVienIds = existStudent.map(
      (sinhVien: any) => sinhVien.sinh_vien_id
    );
    const sinhVienIds = data.map((item: any) => item.sinh_vien_id);

    const listId = listSinhVienIds?.filter(
      (id: number) => !sinhVienIds?.includes(id)
    );
    setListId(listId);
  }, [existStudent, data]);
  const getSinhVien = async () => {
    if (listId.length === 0) {
      return;
    } else {
      try {
        const res = await sinhVienApi.listSV(listId);
        if (Array.isArray(res.data)) {
          setSinhVienList(res.data);
        }
      } catch (error) {
        console.log(error);
        api.error({
          message: "Lỗi khi lấy dữ liệu sinh viên",
          description:
            "Đã xảy ra lỗi trong quá trình lấy dữ liệu sinh viên, chúng tôi sẽ sớm khắc phục, vui lòng quay lại sau!"
        });
      }
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
    try {
      await lopThiApi.addSinhVien({
        ...values,
        lop_thi_id: lop_thi_id
      });

      api.success({
        message: t("message.success_create"),
        description: t("message.success_desc_create_")
      });
      setShowModal(false);
      form.resetFields();
      getData();
      getSinhViens();
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      setErrorMessage(err.data);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_create"),
          description: t("message.error_desc_create_")
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
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setErrorMessage(null);
  };

  useEffect(() => {
    getSinhVien();
  }, [param.search, existStudent, data, listId]);

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
          <p className="modal-title">Thêm sinh viên mới vào lớp thi</p>
          <p>Thêm sinh viên mới vào lớp thi</p>
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
            rules={[{ required: true, message: t("required.stt") }]}
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
            name="sinh_vien_id"
            rules={[
              {
                required: true,
                message: "Trường sinh viên không được bỏ trống"
              }
            ]}
            validateStatus={validateForm(
              errorMessage?.errors?.sinh_vien_id?.length
            )}
            help={
              errorMessage?.errors?.sinh_vien_id
                ? errorMessage?.errors?.sinh_vien_id[0]
                : undefined
            }
          >
            <Select showSearch onSearch={handleChange} filterOption={false}>
              {renderOption(sinhVienList)}
            </Select>
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
                {t("action.create_new")}
              </ColorButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddStudent;
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
