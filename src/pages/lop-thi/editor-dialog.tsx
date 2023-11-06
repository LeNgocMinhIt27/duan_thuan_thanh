import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Select, notification, DatePicker } from "antd";

import ColorButton from "@/components/Button";
import { LoaiLopThi } from "@/interface/lop-thi";

import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";
import { convertErrorAxios } from "@/api/axios";
import lopHocApi from "@/api/lop/lopHoc.api";
import lopThiApi from "@/api/lop/lopThi.api";
import { useTranslation } from "react-i18next";
import configApi from "@/api/config.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { t } = useTranslation("lop-thi");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const [kiHoc, setKiHoc] = useState<string[]>([]);
  const [lopHocList, setLopHocList] = useState<string[]>([]);
  const [loaiData, setLoaiData] = useState<LoaiLopThi[]>([]);

  const [errorMessage, setErrorMessage] =
    useState<LaravelValidationResponse | null>(null);
  const [param, setParam] = useState<any>({
    page: 1,
    itemsPerPage: 300,
    paginate: true,
    sortModel: [],
    ki_hoc: ""
  });

  // const getKyHoc = async () => {
  //   try {
  //     const res = await kyHocApi.list();
  //     if (res.data && res.data.length > 0) setKiHoc(res.data);
  //   } catch (error) {
  //     api.error({
  //       message: "Lỗi khi lấy dữ liệu kì học",
  //       description:
  //         "Đã xảy ra lỗi trong quá trình lấy dữ liệu kì học, chúng tôi sẽ sớm khắc phục, vui lòng quay lại sau!",
  //     });
  //   }
  // };

  const fetchLopHocList = async () => {
    try {
      const kiHocValue = form.getFieldValue("ki_hoc");
      setParam({
        page: 1,
        itemsPerPage: 300,
        paginate: true,
        sortModel: [],
        ki_hoc: kiHocValue
      });

      const res = await lopHocApi.list(param);
      if (res.data && res.data.list && res.data.list.length > 0) {
        const filteredLopHocList = res.data.list.filter((item: any) => {
          return item.ki_hoc === form.getFieldValue("ki_hoc");
        });

        setLopHocList(filteredLopHocList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };

  const handleChangeKiHoc: any = (name: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (name && updatedErrors[name]) {
        updatedErrors[name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
    fetchLopHocList();
    form.setFieldsValue({ lop_id: undefined });
  };

  useEffect(() => {
    fetchLopHocList();
  }, [form.getFieldValue("ki_hoc")]);

  // const formatTimeRangeToString = (timeRange: any) => {
  //   const [startTime, endTime] = timeRange;
  //   const startTimeString = startTime.format("H[h]mm");
  //   const endTimeString = endTime.format("H[h]mm");
  //   return `${startTimeString} - ${endTimeString}`;
  // };

  // const formatTimeRangeToString = (timeRange: any) => {
  //   const [startTime, endTime] = timeRange;
  //   const startTimeString = moment(startTime).format("H[h]mm");
  //   const endTimeString = moment(endTime).format("H[h]mm");
  //   return `${startTimeString} - ${endTimeString}`;
  // };

  const onFinish = async (values: any) => {
    setLoading(true);

    // values.kip_thi = formatTimeRangeToString(values.kip_thi);

    if (isEdit) {
      try {
        await lopThiApi.edit({
          ...data,
          ...values,
          ngay_thi: values.ngay_thi.format("YYYY-MM-DD")
        });
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
        await lopThiApi.create(values);
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
    if (isEdit && data) {
      // let kip_thi: any = [];
      // if (typeof data.kip_thi === "string" && data.kip_thi.includes(" - ")) {
      //   kip_thi = [
      //     dayjs(data.kip_thi.split(" - ")[0], "H[h]mm"),
      //     dayjs(data.kip_thi.split(" - ")[1], "H[h]mm")
      //   ];
      // }
      form.setFieldsValue({
        ...data,
        ma: data.ma_lop_thi,
        ngay_thi: dayjs(data.ngay_thi).tz("Asia/Ho_Chi_Minh"),
        kip_thi: data.kip_thi
      });
    }
  }, [form, data, isEdit]);

  // useEffect(() => {
  //   getKyHoc();
  // }, []);

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

  useEffect(() => {
    const fetchLoaiData = async () => {
      try {
        const response = await lopThiApi.listLoaiThi();

        if (response.data && Array.isArray(response.data)) {
          setLoaiData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLoaiData();
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
            initialValues={{ role_code: "admin" }}
            layout="vertical"
            className="base-form"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="Kì học"
              name="ki_hoc"
              rules={[{ required: true, message: t("required.ki_hoc") }]}
            >
              <Select
                onChange={(selectedValues) => {
                  handleChangeKiHoc(selectedValues);
                }}
              >
                {renderOptionAdmin(kiHoc)}
              </Select>
            </Form.Item>
            <Form.Item
              label="Mã lớp"
              name="lop_id"
              rules={[{ required: true, message: t("required.lop_hoc") }]}
            >
              <Select>
                {lopHocList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.ma} - {item.ten_hp}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Mã lớp thi"
              name="ma"
              rules={[{ required: true, message: t("required.ma_lop_thi") }]}
              validateStatus={validateForm(errorMessage?.errors?.ma?.length)}
              help={
                errorMessage?.errors?.ma
                  ? errorMessage?.errors?.ma[0]
                  : undefined
              }
            >
              <Input onChange={() => handleChange("ma")}></Input>
            </Form.Item>
            <Form.Item label="Phòng" name="phong_thi">
              <Input onChange={() => handleChange("phong_thi")}></Input>
            </Form.Item>
            <Form.Item
              label="Loại"
              name="loai"
              rules={[{ required: true, message: t("required.loai") }]}
            >
              <Select>
                {loaiData.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày thi"
              name="ngay_thi"
              rules={[{ required: true, message: t("required.ngay_thi") }]}
            >
              <DatePicker
                placeholder="Chọn ngày thi"
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>
            {/* <Form.Item
              label="Kíp thi"
              name="kip_thi"
              rules={[{ required: true, message: t("required.kip_thi") }]}
            >
              <TimePicker.RangePicker
                format="H[h]mm"
                showSecond={false}
                className="w-full"
              />
            </Form.Item> */}
            <Form.Item
              label="Kíp thi"
              name="kip_thi"
              rules={[{ required: true, message: t("required.ngay_thi") }]}
            >
              <Input
                onChange={() => handleChange("kip_thi")}
                placeholder="ex: 7h30-10h"
              ></Input>
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
