import { Button, Card, Space, Table, Typography, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { FC, useCallback, useEffect, useState } from "react";
import { LanDiemDanh, Lop } from "@/interface/lop";

import BaseResponsive from "@/components/base-responsive";
import Column from "antd/es/table/Column";
import CreateNEditDialog from "@/components/createNEditDialog";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { Link } from "react-router-dom";
import TaoDiemDanh from "./modal-add-diem-danh";
import dayjs from "dayjs";
import { format } from "date-fns";
import lanDiemDanhApi from "@/api/lop/lanDiemDanh.api";

const optionsEdit = [
  {
    type: "date",
    name: "ngay_diem_danh",
    placeholder: "Ngày điểm danh",
    label: "Ngày điểm danh",
    timeFomat: "DD/MM/YYYY"
  },
  {
    type: "date",
    name: "ngay_mo_diem_danh",
    placeholder: "Ngày mở điểm danh",
    label: "Ngày mở điểm danh",
    timeFomat: "DD/MM/YYYY"
  },
  {
    type: "date",
    name: "ngay_dong_diem_danh",
    placeholder: "Ngày đóng điểm danh",
    label: "Ngày đóng điểm danh",
    timeFomat: "DD/MM/YYYY"
  }
];
const { Title } = Typography;
const LopHocListDiemDanhPage: FC<{ lop: Lop }> = ({ lop }) => {
  const [loading, setLoading] = useState(false);
  const [key, setKeyRender] = useState(1);
  const [dataSource, setDataSource] = useState<LanDiemDanh[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const getData = useCallback(async () => {
    setLoading(true);
    let items: LanDiemDanh[] = [];
    try {
      const res = await lanDiemDanhApi.list({ lop_id: lop.id });
      items = res.data.list;
    } finally {
      setDataSource(items);
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
  const onUpdateItem = (item: LanDiemDanh) => {
    if (item.ngay_diem_danh) {
      item.ngay_diem_danh = dayjs(item.ngay_diem_danh);
    }
    if (item.ngay_dong_diem_danh) {
      item.ngay_dong_diem_danh = dayjs(item.ngay_dong_diem_danh);
    }
    if (item.ngay_mo_diem_danh) {
      item.ngay_mo_diem_danh = dayjs(item.ngay_mo_diem_danh);
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
  const contentDesktop = () => (
    <Table
      pagination={false}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
    >
      <Column title="Lần" dataIndex="lan" key="lan" />
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
      />
      <Column
        title="Ngày mở điểm danh"
        dataIndex="ngay_mo_diem_danh"
        key="ngay_mo_diem_danh"
        render={(_: any, record: LanDiemDanh | any) => {
          const res = !record.ngay_mo_diem_danh
            ? ""
            : format(new Date(record.ngay_mo_diem_danh), "dd/MM/yyyy");
          return <Space size="middle">{res}</Space>;
        }}
      />
      <Column
        title="Ngày đóng điểm danh"
        dataIndex="ngay_dong_diem_danh"
        key="ngay_dong_diem_danh"
        render={(_: any, record: LanDiemDanh | any) => {
          const res = !record.ngay_dong_diem_danh
            ? ""
            : format(new Date(record.ngay_dong_diem_danh), "dd/MM/yyyy");
          return <Space size="middle">{res}</Space>;
        }}
      />
      <Column
        title="Hành động"
        key="action"
        width={120}
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
  );
  const contentMobile = () => (
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
          className="pt-1"
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
            />,
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              type="text"
              onClick={() => onDeleteItem(record)}
            />
          ]}
        >
          <p>
            <strong>Ngày điểm danh: </strong>
            {record.ngay_diem_danh
              ? format(new Date(record.ngay_diem_danh.toString()), "dd/MM/yyyy")
              : ""}
          </p>
          <p>
            <strong>Ngày mở điểm danh: </strong>
            {record.ngay_mo_diem_danh
              ? format(
                  new Date(record.ngay_mo_diem_danh.toString()),
                  "dd/MM/yyyy"
                )
              : ""}
          </p>
          <p>
            <strong>Ngày đóng điểm danh: </strong>
            {record.ngay_dong_diem_danh
              ? format(
                  new Date(record.ngay_dong_diem_danh.toString()),
                  "dd/MM/yyyy"
                )
              : ""}
          </p>
        </Card>
      ))}
    </div>
  );
  return (
    <>
      {contextHolder}
      <div className="d-flex items-center justify-between">
        <Title level={3}>Điểm danh</Title>
        <Button type="primary" onClick={onCreateItem}>
          Tạo mới
        </Button>
      </div>
      <BaseResponsive
        contentDesktop={contentDesktop}
        contentMobile={contentMobile}
      />
      <CreateNEditDialog
        // apiCreate={(data: any) =>
        //   lanDiemDanhApi.create({
        //     ...data,
        //     lop_id: lop.id,
        //   })
        // }
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
      <TaoDiemDanh
        openModal={isCreate}
        closeModal={handleCloseCreate}
        translation="lan-diem-danh"
        setKeyRender={setKeyRender}
        data={data}
        api={(data: any) =>
          lanDiemDanhApi.create({
            ...data,
            lop_id: lop.id
          })
        }
        callnofi={api}
      />
    </>
  );
};

export default LopHocListDiemDanhPage;
