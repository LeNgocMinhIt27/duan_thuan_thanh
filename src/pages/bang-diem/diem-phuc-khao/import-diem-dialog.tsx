import {
  Button,
  Drawer,
  Form,
  Modal,
  Select,
  Table,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  notification
} from "antd";
import {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import ColorButton from "@/components/Button";
import type { ColumnsType } from "antd/es/table";
import type { ImportType } from "@/api/import.api";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { convertErrorAxios } from "@/api/axios";
import downloadApi from "@/api/download.api";
import importApi from "@/api/import.api";
import { useTranslation } from "react-i18next";

interface Props {
  fileDownloadName: string;
  extraDownloadFileHeader?: string[];
  translation: string;
  downloadable?: boolean;
  buttonTextStyle?: CSSProperties;
  fieldName: { name: string; ghi_chu?: string }[];
  uploadformApi: (data: any) => Promise<any>;
  buttonStyle?: CSSProperties;
  buttonClass?: string;
  suggestType?: ImportType;
  extraFormItemCompoment?: { position: "top" | "below"; element: ReactNode };
}

const { Title } = Typography;
const { Dragger } = Upload;

const ImportDiemPhucKhaoAmin: FC<Props> = (props) => {
  const {
    translation,
    fieldName,
    extraDownloadFileHeader,
    fileDownloadName,
    uploadformApi,
    suggestType,
    downloadable,
    extraFormItemCompoment
  } = props;

  const { t } = useTranslation(translation);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [returnExcelValue, setReturnExcelValue] = useState<{
    headers: string[];
    items: object[];
    total: number;
  } | null>(null);
  const [returnValue, setReturnValue] = useState<any>();
  const [opendrawer, setOpenDrawer] = useState(false);
  const [openExcelModal, setOpenExcelModal] = useState(false);
  const [openDragModal, setOpenDragModal] = useState(false);
  const [suggestList, setSuggestList] = useState<{
    [index: string]: string[];
  }>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [columns, setColums] = useState<ColumnsType<any>>(
    fieldName.map((x) => ({
      title: t("field." + x.name),
      dataIndex: x.name,
      key: x.name
    }))
  );

  useEffect(() => {
    extraDownloadFileHeader?.forEach((x) => {
      setColums((predata) => [
        ...predata,
        {
          title: t("field." + x),
          dataIndex: x,
          key: x
        }
      ]);
    });
  }, [extraDownloadFileHeader?.toString()]);

  const sendForm = async (values: any) => {
    setLoading(true);
    let sendata: any = {};
    if (values.ki_hoc) {
      sendata = {
        fields: values,
        ki_hoc: values.ki_hoc,
        items: returnExcelValue?.items
      };
    } else {
      sendata = {
        fields: values,
        items: returnExcelValue?.items
      };
    }
    if (extraDownloadFileHeader) {
      extraDownloadFileHeader.forEach((x) => {
        sendata.fields[x] = x;
      });
    }
    try {
      const data = await uploadformApi(sendata);
      setReturnValue(data.data);
      api.success({
        message: t("message.success_uploadForm"),
        description: t("message.success_desc_uploadForm")
      });
      if (downloadable) setOpenExcelModal(true);
      setOpenDrawer(false);
      form.resetFields();
    } catch (err: any) {
      const res = convertErrorAxios<LaravelValidationResponse>(err);
      if (res.type === "axios-error") {
        api.error({
          message: t("message.error_uploadForm"),
          description: res.error.response?.data.message
            ? res.error.response?.data.message
            : t("message.error_desc_uploadForm")
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const importprops: UploadProps = {
    name: "file",
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList([...newFileList]);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList
  };

  //fill suggest
  useEffect(() => {
    const data: { [index: string]: any } = {};
    if (suggestList) {
      fieldName?.forEach((x) => {
        if (
          suggestList[x.name] != undefined &&
          suggestList[x.name] instanceof Array
        ) {
          suggestList[x.name].every((f) => {
            if (returnExcelValue?.headers.includes(f)) {
              data[x.name] = f;
              return false;
            } else {
              data[x.name] = null;
            }
          });
        }
      });
    }
    form.setFieldsValue(data);
  }, [returnExcelValue?.headers]);

  const handleUpload = async () => {
    setUploading(true);
    // You can use any AJAX library you like
    const data = await importApi.readExcel(fileList[0] as any).finally(() => {
      setUploading(false);
    });
    if (suggestType) {
      try {
        const suggestData = await importApi.importSuggest(suggestType);
        setSuggestList(suggestData);
      } catch (err) {
        console.error(err);
      }
    }
    setReturnExcelValue(data.data);
    setOpenDragModal(false);
    setOpenDrawer(true);
  };

  const closeDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const closeExcelModal = useCallback(() => {
    setOpenExcelModal(false);
  }, []);
  const closeDragModal = useCallback(() => {
    setOpenDragModal(false);
  }, []);

  useEffect(() => {
    setFileList([]);
  }, [openDragModal]);

  const DownExcel = async () => {
    setLoading(true);
    const header: any[] = [];
    fieldName?.forEach((x) => {
      const temp = { text: x.name, value: x.name };
      header.push(temp);
    });
    if (extraDownloadFileHeader)
      extraDownloadFileHeader.forEach((x) => {
        const temp = { text: x, value: x };
        header.push(temp);
      });
    try {
      await downloadApi.downloadExcel({
        name: fileDownloadName,
        title: fileDownloadName,
        data: returnValue,
        headers: header
      });
      api.success({
        message: t("message.success_download"),
        description: t("message.success_desc_download")
      });
    } catch (err) {
      api.error({
        message: t("message.error_download"),
        description: t("message.error_desc_download")
      });
    } finally {
      setLoading(false);
      setOpenExcelModal(false);
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          setOpenDragModal(true);
        }}
        type="primary"
        icon={<UploadOutlined />}
      >
        Tải lên điểm phúc khảo
      </Button>
      <Modal
        centered
        open={openDragModal}
        onCancel={closeDragModal}
        okText={uploading ? t("action.uploading") : t("action.start_upload")}
        cancelText={t("action.cancel")}
        confirmLoading={uploading}
        onOk={handleUpload}
      >
        <Title level={5} className="mt-2">
          {t("upload.title")}
        </Title>
        <Dragger {...importprops}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t("upload.drag_desc")}</p>
          <p className="ant-upload-hint">{t("upload.drag_desc_hint")}</p>
        </Dragger>
      </Modal>
      {contextHolder}
      <Drawer open={opendrawer} onClose={closeDrawer} className="relative">
        <Form
          className="base-form"
          form={form}
          style={{ maxHeight: "98%" }}
          layout="vertical"
          onFinish={sendForm}
        >
          {extraFormItemCompoment?.position === "top" &&
            extraFormItemCompoment.element}
          {fieldName?.map((x, index) => {
            return (
              <Form.Item
                name={x.name}
                key={index}
                rules={[{ required: true }]}
                label={t(`field.${x.name}`)}
                extra={x.ghi_chu}
              >
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={returnExcelValue?.headers.map((a) => ({
                    label: a,
                    value: a
                  }))}
                ></Select>
              </Form.Item>
            );
          })}
          <Form.Item className=" pt-4 pb-4  bg-white">
            <div className="flex justify-between gap-3">
              <ColorButton block onClick={closeDrawer}>
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
      </Drawer>
      {downloadable && (
        <Modal
          centered
          open={openExcelModal}
          onCancel={closeExcelModal}
          okText={t("action.download")}
          cancelText={t("action.cancel")}
          confirmLoading={loading}
          onOk={DownExcel}
        >
          <Table
            style={{ margin: "13px 15px 0" }}
            columns={columns}
            dataSource={returnValue}
          />
        </Modal>
      )}
    </>
  );
};

export default ImportDiemPhucKhaoAmin;
