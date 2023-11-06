import { Button, Card, Space, Table, Typography, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";
import { LanDiemDanh, Lop } from "@/interface/lop";

import Column from "antd/es/table/Column";
import CreateNEditDialog from "@/components/createNEditDialog";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { Link } from "react-router-dom";
import TaoDiemDanh from "./modal-ngay-diem-danh";
import dayjs from "dayjs";
import { format } from "date-fns";
import lanDiemDanhApi from "@/api/lop/lanDiemDanh.api";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import { useMediaQuery } from "react-responsive";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const optionsEdit = [
  {
    type: "date",
    name: "ngay_diem_danh",
    placeholder: "Ngày điểm danh",
    label: "Ngày điểm danh",
    timeFomat: "DD/MM/YYYY"
  }
];
const { Title } = Typography;
const LopHocListDiemDanhPage: FC<{ lop: Lop }> = ({ lop }) => {
  const [loading, setLoading] = useState(false);
  const [key, setKeyRender] = useState(1);
  const [dataSource, setDataSource] = useState<LanDiemDanh[]>([]);

  const getData = useCallback(async () => {
    setLoading(true);
    let items: LanDiemDanh[] = [];
    try {
      const res = await lanDiemDanhApi.list({ lop_id: lop.id });
      items = res.data.list;
      setDataSource(items);
    } finally {
      setLoading(false);
    }
  }, [lop]);
  useEffect(() => {
    getData();
  }, [key]);
  const [data, setData] = useState<LanDiemDanh>();
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const onUpdateItem = (item: LanDiemDanh) => {
    if (item.ngay_diem_danh) {
      item.ngay_diem_danh = dayjs(item.ngay_diem_danh).tz("Asia/Ho_Chi_Minh");
    }
    setData(item);
    setIsModalEdit(true);
    setIsEdit(true);
  };
  const onCreateItem = () => {
    setData({ lop_id: lop.id } as any);
    setIsCreate(true);
    setIsEdit(false);
  };
  const handleCloseCreate = () => {
    setIsCreate(false);
  };
  const isMobile = useMediaQuery({ minWidth: 600 });

  const onDeleteItem = (item: LanDiemDanh) => {
    const maxId = Math.max(...dataSource.map((dataItem) => dataItem.id));
    if (item.id === maxId) {
      setData(item);
      setIsModalDelete(true);
    } else {
      api.error({
        message: "Thất bại",
        description:
          "Bạn không thể xóa lần điểm danh nếu có lần điểm danh được tạo sau đó!"
      });
    }
  };
  const customTableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "5px"
  };
  return (
    <>
      {contextHolder}
      {isMobile ? (
        <>
          <div className="d-flex items-center justify-between">
            <Typography.Title level={3}>Điểm danh</Typography.Title>
            <Button type="primary" onClick={onCreateItem}>
              Tạo mới
            </Button>
          </div>
          <Table
            pagination={false}
            dataSource={dataSource}
            loading={loading}
            rowKey="id"
            style={customTableStyle}
          >
            <Column
              title="Lần"
              dataIndex="lan"
              key="lan"
              align="center"
              width={80}
            />
            <Column
              title="Ngày điểm danh"
              dataIndex="ngay_mo_diem_danh"
              key="ngay_diem_danh"
              render={(_: any, record: LanDiemDanh | any) => {
                const res = !record.ngay_diem_danh
                  ? ""
                  : format(new Date(record.ngay_diem_danh), "dd/MM/yyyy");
                return <Space size="middle">{res}</Space>;
              }}
              align="center"
            />
            <Column
              title="Hành động"
              key="action"
              width={120}
              align="center"
              render={(_: any, record: LanDiemDanh) => (
                <Space size="middle">
                  <Link to={"diem-danh/" + record.id}>
                    <Button
                      shape="circle"
                      icon={<OrderedListOutlined />}
                      type="text"
                    />
                  </Link>
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    type="text"
                    onClick={() => onUpdateItem(record)}
                  />
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
        <>
          <div className="d-flex items-center justify-between">
            <Title level={3}>Điểm danh</Title>
            <Button type="primary" onClick={onCreateItem}>
              Tạo mới
            </Button>
          </div>
          <div className="card-container card-diem-danh">
            {dataSource.map((record: LanDiemDanh) => (
              <Card
                key={record.id}
                title={
                  <>
                    <strong className="card-diem-danh__title">Lần : </strong>
                    <span className="card-diem-danh__sub">{record.lan}</span>
                  </>
                }
                actions={[
                  <Link to={"diem-danh/" + record.id}>
                    <OrderedListOutlined key="details" />
                  </Link>,
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    type="text"
                    key="edit"
                    onClick={() => onUpdateItem(record)}
                  />
                ]}
              >
                <p>
                  <strong>Ngày điểm danh: </strong>
                  {record.ngay_diem_danh
                    ? format(
                        new Date(record.ngay_diem_danh.toString()),
                        "dd/MM/yyyy"
                      )
                    : ""}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
      <CreateNEditDialog
        apiCreate={() => {}}
        apiEdit={lanDiemDanhApi.edit}
        options={optionsEdit}
        translation={"lan-diem-danh"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
      />
      <TaoDiemDanh
        api={(data: any) =>
          lanDiemDanhApi.create({
            ngay_diem_danh: data.ngay_diem_danh,
            lop_id: lop.id
          })
        }
        translation={"lan-diem-danh"}
        data={data}
        openModal={isCreate}
        closeModal={handleCloseCreate}
        setKeyRender={setKeyRender}
        callnofi={api}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="lan-diem-danh"
        closeModal={setIsModalDelete}
        name="lần điểm danh"
        apiDelete={() =>
          data && lanDiemDanhApi.delete(data, { lop_id: lop.id })
        }
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default LopHocListDiemDanhPage;
