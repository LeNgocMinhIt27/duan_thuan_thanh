import { FC, ReactNode, useEffect, useState } from "react";

import {
  Modal,
  Form,
  Input,
  notification,
  Select,
  Switch,
  Checkbox,
  TimePicker,
  DatePicker,
  InputNumber
} from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTranslation } from "react-i18next";
import ColorButton from "../Button";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { dealsWith } from "@/api/axios/error-handle";
import { AxiosError } from "axios";

interface ChildrenOption {
  value: string | number;
  title: string;
  label?: string;
}

export interface Option {
  required?: boolean;
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
    | string;
  name: string;
  password?: boolean;
  children?: ChildrenOption[];
  label: string;
  subTitle?: string;
  rule?: object[];
  mode?: "multiple" | "tags";
  timeFomat?: string;
  placeholder?: string;
  defaultValue?: object[];
}

interface Props {
  openModal: boolean;
  data?: any;
  closeModal: (value: boolean) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  setKeyRender: (value: number) => void;
  translation: string;
  options: Option[];
  apiEdit: any;
  icon?: ReactNode;
  onEditSuccess?: () => void;
}

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EditDialog: FC<Props> = (props) => {
  const {
    openModal,
    closeModal,
    data,
    isEdit,
    setIsEdit,
    setKeyRender,
    translation,
    options,
    apiEdit,
    icon,
    onEditSuccess
  } = props;
  const { t } = useTranslation(translation);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<
    LaravelValidationResponse | undefined
  >();

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue(data);
    }
  }, [isEdit, data, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      await apiEdit({ ...data, ...values });
      api.success({
        message: t("message.success_edit"),
        description: t("message.success_desc_edit")
      });
      closeModal(false);
      form.resetFields();
      setIsEdit(false);
      setKeyRender(Math.random());
      if (onEditSuccess) onEditSuccess();
    } catch (err: any) {
      dealsWith({
        "422": (e: any) => {
          const error = e as AxiosError<LaravelValidationResponse>;
          if (error.response) setErrorMessage(error.response.data);
        }
      })(err);
      api.error({
        message: t("message.error_edit"),
        description: t("message.error_edit")
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (option: Option) => {
    if (errorMessage) {
      const updatedErrors = { ...errorMessage.errors };
      if (option.name && updatedErrors[option.name]) {
        updatedErrors[option.name] = [];
        setErrorMessage({ ...errorMessage, errors: updatedErrors });
      }
    }
  };

  const validateForm = (option: Option) => {
    if (errorMessage && errorMessage.errors?.[option.name]?.length) {
      return "error";
    }
  };

  const cancel = () => {
    closeModal(false);
    setIsEdit(false);
    form.resetFields();
    setErrorMessage(undefined);
  };

  const renderOption = (value: Option) => {
    if (value.type.toLowerCase() === "input") {
      return value.password ? (
        <Input.Password
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      ) : (
        <Input
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "inputnumber") {
      return (
        <InputNumber
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "select") {
      return (
        <Select
          placeholder={value.placeholder}
          allowClear={!value.required}
          mode={value.mode}
          onChange={() => handleChange(value)}
        >
          {value.children?.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.title}
            </Option>
          ))}
        </Select>
      );
    } else if (value.type.toLowerCase() === "textarea") {
      return <TextArea placeholder={value.placeholder} />;
    } else if (value.type.toLowerCase() === "switch") {
      return <Switch />;
    } else if (value.type.toLowerCase() === "checkbox") {
      return <Checkbox>{value.subTitle}</Checkbox>;
    } else if (value.type.toLowerCase() === "timepicker") {
      return (
        <TimePicker
          placeholder={value.placeholder}
          format={value.timeFomat}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "timerange") {
      return <TimePicker.RangePicker onChange={() => handleChange(value)} />;
    } else if (value.type.toLowerCase() === "datepicker") {
      return (
        <DatePicker
          placeholder={value.placeholder}
          format={value.timeFomat}
          onChange={() => handleChange(value)}
          className="w-full"
        />
      );
    } else if (value.type.toLowerCase() === "autocomplete") {
      return (
        <Select
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
          format={value.timeFomat}
          onChange={() => handleChange(value)}
        />
      );
    } else if (value.type.toLowerCase() === "password") {
      return (
        <Input.Password
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    } else {
      return (
        <Input
          placeholder={value.placeholder}
          onChange={() => handleChange(value)}
        />
      );
    }
  };

  return (
    <div>
      {contextHolder}
      <Modal
        centered
        open={openModal}
        onCancel={cancel}
        footer={<></>}
        className="relative"
      >
        <div className="create-icon">
          <div>{icon ? icon : <SiMicrosoftexcel />}</div>
        </div>

        <div className="modal-title-wapper">
          <p className="modal-title">{t("title.edit")}</p>
          <p>{t("sub_title.edit")}</p>
        </div>
        <Form
          className="base-form"
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {options.map((option: Option, index: number) => (
            <Form.Item
              label={option.label}
              name={option.name ? option.name : undefined}
              rules={option.rule ? option.rule : undefined}
              key={index}
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
      </Modal>
    </div>
  );
};

export default EditDialog;
