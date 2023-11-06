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

import ColorButton from "../Button";
import type { ColumnsType } from "antd/es/table";
import type { ImportType } from "@/api/import.api";
import { LaravelValidationResponse } from "@/interface/axios/laravel";
import { convertErrorAxios } from "@/api/axios";
import downloadApi from "@/api/download.api";
import importApi from "@/api/import.api";
import { useTranslation } from "react-i18next";

interface Props {
  fileDownloadName: string;
  buttonElement?: ReactNode;
  extraDownloadFileHeader?: { keyName: string; value: any }[];
  extraUploadObjKey?: string[];
  translation: string;
  uploadType?: string;
  appcectType?: Blob["type"][];
  downloadable?: boolean;
  setKeyRender?: any;
  buttonTextStyle?: CSSProperties;
  fieldName: { name: string; ghi_chu?: string; isRequired?: boolean }[];
  uploadformApi: (data: any) => Promise<any>;
  buttonStyle?: CSSProperties;
  buttonClass?: string;
  suggestType?: ImportType;
  extraFormItemCompoment?: { position: "top" | "below"; element: ReactNode };
}

const { Title } = Typography;
const { Dragger } = Upload;
const ImportExcelCompoment: FC<Props> = (props) => {
  const {
    translation,
    buttonElement,
    fieldName,
    extraDownloadFileHeader,
    fileDownloadName,
    uploadformApi,
    appcectType,
    extraUploadObjKey,
    uploadType,
    suggestType,
    setKeyRender,
    buttonClass,
    buttonStyle,
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
          title: t("field." + x.keyName),
          dataIndex: x.keyName,
          key: x.keyName
        }
      ]);
    });
  }, [extraDownloadFileHeader?.toString()]);

  const sendForm = async (values: any) => {
    setLoading(true);
    const sendata: any = {
      fields: values,
      items: returnExcelValue?.items
    };

    if (extraUploadObjKey) {
      extraUploadObjKey.forEach((key) => {
        sendata[key] = values[key];
      });
    }
    if (extraDownloadFileHeader) {
      extraDownloadFileHeader.forEach((x) => {
        sendata.fields[x.keyName] = x.value;
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
      // form.resetFields();
      setKeyRender(Math.random());
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
    accept: uploadType,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList([...newFileList]);
    },
    beforeUpload: (file) => {
      if (appcectType != undefined) {
        const isAcceptfile = appcectType.includes(file.type);
        if (isAcceptfile) {
          setFileList([...fileList, file]);
        } else {
          api.error({
            message: t("message.error_unmatch_type"),
            description:
              t("message.error_desc_unmatch_type_before") +
              file.name +
              t("message.error_desc_unmatch_type_after"),
            duration: 2
          });
        }
      } else {
        setFileList([...fileList, file]);
      }

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
              return true;
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
      <div
        onClick={() => {
          setOpenDragModal(true);
        }}
      >
        {buttonElement ? (
          buttonElement
        ) : (
          <div
            style={{ ...buttonStyle, cursor: "pointer" }}
            className={
              buttonClass +
              " bg-white w-full flex items-center justify-center max-w-[150px] max-h-[250px] h-full aspect-[3/4] border-gray-200 border-solid "
            }
          >
            <div className="flex flex-col items-center justify-center">
              <Button
                className="decoration-red-500"
                type="primary"
                color="third"
                shape="circle"
                style={{ width: "3rem", height: "3rem" }}
                icon={<UploadOutlined style={{ fontSize: "1.7rem" }} />}
              ></Button>
              <Title
                level={5}
                className="mt-2 max-h-12 mb-0 ps-1 pe-1 text-center"
              >
                {t("action.import")}
              </Title>
            </div>
          </div>
        )}
      </div>

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
      <Drawer
        open={opendrawer}
        onClose={closeDrawer}
        footer={<></>}
        className="relative"
      >
        <Form
          className="base-form"
          form={form}
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
                rules={
                  x.isRequired === false
                    ? undefined
                    : [
                        {
                          required: true,
                          message: `Hãy nhập thông tin cho trường ${t(
                            `field.${x.name}`
                          ).toLowerCase()}`
                        }
                      ]
                }
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
                  options={returnExcelValue?.headers
                    .filter((x) => x != null)
                    .map((a) => ({
                      label: a,
                      value: a
                    }))}
                ></Select>
              </Form.Item>
            );
          })}
          {extraFormItemCompoment?.position === "below" &&
            extraFormItemCompoment.element}
          <Form.Item className="absolute bottom-0 right-0 left-0 px-6 pt-4 bg-white">
            <div className="flex justify-between gap-4">
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

export default ImportExcelCompoment;
