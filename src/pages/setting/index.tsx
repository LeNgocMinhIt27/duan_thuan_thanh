import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography,
  notification
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";

import ColorButton from "@/components/Button";
import { sdk } from "@/api/axios";
import { useTranslation } from "react-i18next";
import configApi from "@/api/config.api";
import ConfigHust from "./config-hust";
import { useAppDispatch } from "@/stores/hook";
import { setHeightAuto } from "@/stores/features/config";
import Column from "antd/es/table/Column";
import EditSettingDialog from "./edit-setting-dialog";
import DeleteDialog from "@/components/dialog/deleteDialog";
import CreateNEditDialog from "@/components/createNEditDialog";
import TimKiemPage from "./tim-kiem-tuan";
import kiHocApi from "@/api/kiHoc/kiHoc.api";

interface DongDiemDanh {
  section_name: string;
  setting_name: string;
  setting_type: string;
  setting_value: string;
  id: number;
  created_at: string;
  updated_at: string;
}

const { Title } = Typography;
const Setting: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("setting");
  const [setting, setSetting] = useState({});
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState<DongDiemDanh[]>([]);
  const [dataEdit, setDataEdit] = useState<DongDiemDanh[]>([]);
  const [key, setKeyRender] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [kiHoc, setKihoc] = useState<{ label: string; value: string }[]>([]);
  const [selectedValue, setSelectedValue] = useState(null);
  useEffect(() => {
    dispatch(setHeightAuto(true));
    return () => {
      dispatch(setHeightAuto(false));
    };
  });
  useEffect(() => {
    const getKihoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data.map((x: any) => ({ value: x, label: x })));
      }
    };
    getKihoc();
  }, []);
  useEffect(() => {
    configApi.getSetting().then((res) => {
      setSetting(res.data);
    });
  }, []);

  const getKiHocSetting = useCallback(async (value: any) => {
    setLoading(true);
    try {
      setSelectedValue(value);
      const res = await configApi.listDongDiemDanh({ ki_hoc: value });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getKiHocSetting(selectedValue);
  }, [key]);
  const deleteCache = async () => {
    setLoading(true);
    try {
      await sdk.get("/cache/clear");
      Object.keys(localStorage)
        .filter((x) => x.startsWith("i18next_res_"))
        .forEach((x) => localStorage.removeItem(x));
      api.success({
        message: t("message.success"),
        description: t("message.success_desc")
      });
    } catch (error) {
      api.error({
        message: t("message.error"),
        description: t("message.error_desc")
      });
    } finally {
      setLoading(false);
    }
  };
  const options = [
    {
      type: "inputnumber",
      name: "mo_diem_danh",
      placeholder: t("hint.mo_diem_danh"),
      label: t("hint.mo_diem_danh"),
      min: 1
    },
    {
      type: "inputnumber",
      name: "dong_diem_danh",
      placeholder: t("hint.mo_diem_danh"),
      label: t("hint.mo_diem_danh"),
      min: 1
    },
    {
      type: "inputnumber",
      name: "dong_tre",
      placeholder: t("hint.dong_tre"),
      label: t("hint.dong_tre"),
      min: 0
    }
  ];
  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  const onUpdateItem = (item: any) => {
    setDataEdit(item);
    setIsEdit(true);
  };
  const onDeleteItem = (item: any) => {
    const maxId = Math.max(...data.map((dataItem) => dataItem.id));
    if (item.id === maxId) {
      setDataEdit(item);
      setIsModalDelete(true);
    } else {
      api.error({
        message: "Thất bại",
        description:
          "Bạn không thể xóa lần điểm danh nếu có lần điểm danh được tạo sau đó!"
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Title level={4}>{t("title.cong_cu")}</Title>
      <Row className="p-2">
        <Col span={12}>
          <ColorButton
            type="primary"
            color="third"
            loading={loading}
            onClick={deleteCache}
            icon={<DeleteOutlined />}
          >
            {t("sub_title.delete_cache")}
          </ColorButton>
        </Col>
        <Col span={6}>
          <Form.Item label="Cài đặt theo kì học">
            <Select
              placeholder="Chọn kì học"
              style={{ maxWidth: "160px" }}
              value={selectedValue}
              onChange={getKiHocSetting}
              options={kiHoc}
            />
          </Form.Item>
        </Col>
        {selectedValue ? (
          <Col>
            <Button onClick={() => setIsModalEdit(true)} type="primary">
              Thêm lần đóng điểm danh
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Row className="p-2">
        <Col span={12} className="p-2">
          <Title level={4}>Cài đặt</Title>
          <ConfigHust setting={setting}></ConfigHust>
        </Col>
        <Col sm={24} md={12} lg={11} className="p-2">
          {selectedValue ? (
            <>
              <Title level={4}>
                Danh sách tuần đóng điểm danh kì học {selectedValue}
              </Title>
              <Table
                pagination={false}
                dataSource={data}
                rowKey="id"
                loading={loading}
              >
                <Column
                  title="Lần"
                  key="index"
                  render={(_text, _record, index) => <span>{index + 1}</span>}
                />
                <Column
                  title="Tuần mở điểm danh"
                  dataIndex="setting_value"
                  align="center"
                  render={(text) => {
                    const maPhanTu = text.split(/-|,|\[|\]/).filter(Boolean);
                    return <span>{maPhanTu[0]}</span>;
                  }}
                />
                <Column
                  title="Tuần đóng điểm danh"
                  dataIndex="setting_value"
                  align="center"
                  render={(text) => {
                    const maPhanTu = text.split(/-|,|\[|\]/).filter(Boolean);
                    return <span>{maPhanTu[1]}</span>;
                  }}
                />
                <Column
                  title="Tuần đóng trễ"
                  dataIndex="setting_value"
                  align="center"
                  render={(text) => {
                    const maPhanTu = text.split(/-|,|\[|\]/).filter(Boolean);
                    return <span>{maPhanTu[2]}</span>;
                  }}
                />
                <Column
                  title="Hành động"
                  key="action"
                  align="center"
                  render={(_: any, record: any) => (
                    <Space>
                      <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => onUpdateItem(record)}
                      ></Button>
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        type="text"
                        onClick={() => onDeleteItem(record)}
                      />
                    </Space>
                  )}
                />
              </Table>
            </>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Row>
        <div>
          <Title level={4}>
            Tìm kiếm chi tiết đóng mở điểm danh theo tuần của lớp học
          </Title>
          <TimKiemPage />
        </div>
      </Row>
      <CreateNEditDialog
        apiCreate={(data: any) => {
          configApi.createDongDiemDanh({
            mo_diem_danh: data.mo_diem_danh,
            dong_diem_danh: data.dong_diem_danh,
            dong_tre: data.dong_tre,
            ki_hoc: selectedValue
          });
        }}
        apiEdit={() => {}}
        options={options}
        translation={"setting"}
        data={dataEdit}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
      />
      <EditSettingDialog
        callnofi={api}
        setting={setting}
        openModal={isEdit}
        closeModal={handleCloseEdit}
        api={configApi.editDongDiemDanh}
        data={dataEdit}
        setKeyRender={setKeyRender}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="setting"
        closeModal={setIsModalDelete}
        name="Đóng điểm danh"
        apiDelete={() => dataEdit && configApi.deleteDongDiemDanh(dataEdit)}
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default Setting;
