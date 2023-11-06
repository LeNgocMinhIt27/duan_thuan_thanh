import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  TimePicker,
  Upload,
  UploadFile,
  UploadProps,
  notification
} from "antd";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import {
  Laravel400ErrorResponse,
  LaravelValidationResponse
} from "@/interface/axios/laravel";

import { AxiosError } from "axios";
import ColorButton from "@/components/Button";
import { SiMicrosoftexcel } from "react-icons/si";
import Title from "antd/es/typography/Title";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { dealsWith } from "@/api/axios/error-handle";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import { useTranslation } from "react-i18next";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
interface ChildrenOption {
  value: string | number;
  title: string;
  label?: string;
}
export interface Option {
  type:
    | "input"
    | "select"
    | "textarea"
    | "inputnumber"
    | "switch"
    | "checkbox"
    | "timepicker"
    | "timerange"
    | "datepicker"
    | "daterange"
    | "autocomplete"
    | "password"
    | "upload"
    | string;
  name: string;
  password?: boolean;
  children?: ChildrenOption[];
  label: string;
  subTitle?: string;
  rule?: object[];
  mode?: "multiple" | "tags";
  timeFomat?: string;
  initialValue?: any | null;
  placeholder?: string;
  defaultValue?: object[];
  uploadfileType?: string;
  min?: number;
  dissabled?: boolean;
}
interface Props {
  openModal: boolean;
  data?: any;
  closeModal: (value: boolean) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  translation: string;
  options: object[];
  apiCreate: any;
  apiEdit: any;
  icon?: ReactNode;
  createIdLop?: string | number;
}
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CreateNEditDialog: FC<Props> = (props) => {
  const {
    openModal,
    closeModal,
    data,
    isEdit,
    setIsEdit,
    setKeyRender,
    translation,
    options,
    apiCreate,
    apiEdit,
    icon,
    createIdLop
  } = props;
  const { t } = useTranslation(translation);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<
    LaravelValidationResponse | undefined
  >();
  const handleError = useCallback((err: any) => {
    return dealsWith({
      "422": (e: any) => {
        const error = e as AxiosError<LaravelValidationResponse>;
        if (error.response) setErrorMessage(error.response.data);
      },
      "400": (e: any) => {
        const error = e as AxiosError<Laravel400ErrorResponse>;
        if (error.response) {
          api.error({
            message: t("message.error_add"),
            description: error.response.data.message
          });
        }
      }
    })(err);
  }, []);
  const onFinish = async (values: { [index: string]: any }) => {
    setLoading(true);
    try {
      for (const keys in values) {
        if (values[keys] instanceof dayjs) {
          values[keys] = values[keys].add(1, "d");
        }
      }
      if (
        values.file != null &&
        values.file != undefined &&
        values.file instanceof Object
      ) {
        if (values.file.fileList.length > 0) {
          values.file = values.file.fileList[0].originFileObj;
        }
      }
    } catch (err) {
      console.error(err);
    }
    if (isEdit) {
      try {
        await apiEdit({ ...data, ...values });
        api.success({
          message: t("message.success_edit"),
          description: t("message.success_desc_edit")
        });
        cancel();
        form.resetFields();
        setIsEdit(false);
        setKeyRender(Math.random());
      } catch (err: any) {
        const is_handle = handleError(err);
        if (!is_handle) {
          api.error({
            message: t("message.error_add"),
            description: t("message.error_desc_add")
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (createIdLop) {
          await apiCreate({ lop_id: createIdLop, ...values });
        } else {
          await apiCreate(values);
        }
        api.success({
          message: t("message.success_add"),
          description: t("message.success_desc_add")
        });
        cancel();
        form.resetFields();
        setKeyRender(Math.random());
      } catch (err: any) {
        const is_handle = handleError(err);
        if (!is_handle) {
          api.error({
            message: t("message.error_add"),
            description: t("message.error_desc_add")
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleChange = (option: any) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (option.name && updatedErrors[option.name]) {
        updatedErrors[option.name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };
  const validateForm = (option: any) => {
    if (errorMessage && errorMessage.errors?.[option.name]?.length) {
      return "error";
    } else {
      return "success";
    }
  };
  const cancel = () => {
    setFileList([]);
    closeModal(false);
    setIsEdit(false);
    form.resetFields();
    setErrorMessage(undefined);
  };
  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue(data);
    }
  }, [isEdit, data, form]);

  const uploadprops: UploadProps = {
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

  const renderOption = (value: Option) => {
    if (value.type.toLowerCase() === "input") {
      return value.password ? (
        <Input.Password
          disabled={value.dissabled}
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      ) : (
        <Input
          disabled={value.dissabled}
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "inputnumber") {
      return (
        <InputNumber
          disabled={value.dissabled}
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
          className="w-full"
          min={value.min}
        />
      );
    } else if (value.type.toLocaleLowerCase() === "select") {
      return (
        <Select
          disabled={value.dissabled}
          placeholder={value.placeholder}
          allowClear
          mode={value.mode}
        >
          {value.children?.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
      );
    } else if (value.type.toLowerCase() === "textarea") {
      return (
        <TextArea disabled={value.dissabled} placeholder={value.placeholder} />
      );
    } else if (value.type.toLowerCase() === "switch") {
      return <Switch disabled={value.dissabled} />;
    } else if (value.type.toLowerCase() === "checkbox") {
      return <Checkbox disabled={value.dissabled}>{value.subTitle}</Checkbox>;
    } else if (value.type.toLowerCase() === "timepicker") {
      return (
        <TimePicker
          disabled={value.dissabled}
          placeholder={value.placeholder}
          format={value.timeFomat}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "timerange") {
      return (
        <TimePicker.RangePicker
          disabled={value.dissabled}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "datepicker") {
      return (
        <DatePicker
          disabled={value.dissabled}
          placeholder={value.placeholder}
          format={value.timeFomat}
          onChange={() => handleChange(value)}
          className="w-full"
        />
      );
    } else if (value.type.toLowerCase() === "date") {
      return (
        <DatePicker
          disabled={value.dissabled}
          style={{ width: "100%" }}
          placeholder={value.placeholder}
          format={(date) => date.format(value.timeFomat)}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "autocomplete") {
      return (
        <Select
          disabled={value.dissabled}
          showSearch
          placeholder={value.placeholder}
          allowClear
          filterOption={(input, option: any) =>
            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          mode={value.mode}
        >
          {value.children?.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
      );
    } else if (value.type.toLowerCase() === "daterange") {
      return (
        <RangePicker
          disabled={value.dissabled}
          format={value.timeFomat}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "password") {
      return (
        <Input.Password
          disabled={value.dissabled}
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "upload") {
      return (
        <Upload
          disabled={value.dissabled}
          {...uploadprops}
          accept={value.uploadfileType}
          style={{ width: "100%" }}
        >
          <Button block icon={<UploadOutlined />}>
            {t("action.select_file")}
          </Button>
        </Upload>
      );
    } else {
      return (
        <Input
          disabled={value.dissabled}
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    }
  };
  return (
    <>
      {contextHolder}
      <Modal open={openModal} onCancel={cancel} footer={<></>}>
        <div className="model-container">
          <div className="model-icon create-icon">
            <div>{icon ? icon : <SiMicrosoftexcel />}</div>
          </div>

          <div className="">
            <Title level={4}>
              {isEdit ? t("title.edit") : t("title.create_new")}
            </Title>
            <p>{isEdit ? t("sub_title.edit") : t("sub_title.create_new")}</p>
          </div>
          <Form
            className="base-form flex-grow-1"
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            {options.map((option: any, index: number) => (
              <Form.Item
                label={option.label}
                name={option.name ? option.name : undefined}
                rules={
                  option.rule
                    ? [
                        {
                          message: `Hãy nhập thông tin cho trường ${t(
                            `field.${option.name}`
                          ).toLowerCase()}`,
                          ...option.rule[0]
                        }
                      ]
                    : undefined
                }
                key={index}
                initialValue={option.initialValue}
                valuePropName={
                  option.type.toLowerCase() === "switch" ||
                  option.type.toLowerCase() === "checkbox"
                    ? "checked"
                    : undefined
                }
                validateStatus={validateForm(option)}
                help={
                  errorMessage?.errors?.[option.name]
                    ? errorMessage?.errors?.[option.name][0]
                    : undefined
                }
              >
                {renderOption(option)}
              </Form.Item>
            ))}
            {!errorMessage ||
            errorMessage.message === "The given data was invalid." ? null : (
              <div
                className="error-message"
                style={{ color: "#ff4d4f", marginTop: "-20px" }}
              >
                {errorMessage.message}
              </div>
            )}
            <Form.Item className="absolute bottom-0 right-0 left-0 px-6 pt-4 bg-white">
              <div className="flex justify-between gap-4">
                <ColorButton block onClick={cancel}>
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

export default CreateNEditDialog;
