import { Space, Table } from "antd";

import Column from "antd/es/table/Column";
import { DiemDanhSinhVien } from "@/interface/lop";
import { FC } from "react";
import { format } from "date-fns";

const TableDiemDanh: FC<any> = ({ diemDanh }) => {
  return (
    <Table rowKey="id" dataSource={diemDanh} pagination={false}>
      <Column title="Lớp" dataIndex="ma_lop" key="ma_lop" />
      <Column title="Loại" dataIndex="loai" key="loai" />
      <Column title="Lần" dataIndex="lan" key="lan" />
      <Column
        title="Ngày điểm danh"
        dataIndex="ngay_diem_danh"
        key="ngay_diem_danh"
        render={(_: any, record: DiemDanhSinhVien) => {
          const res = !record.ngay_diem_danh
            ? ""
            : typeof record.ngay_diem_danh === "string"
            ? format(new Date(record.ngay_diem_danh), "dd/MM/yyyy")
            : record.ngay_diem_danh.format("dd/MM/yyyy");
          return <Space size="middle">{res}</Space>;
        }}
      />
      <Column
        title="Điểm danh"
        dataIndex="diem_danhs"
        key="diem_danhs"
        render={(_: any, record: DiemDanhSinhVien) => {
          return (
            <Space size="middle">{record.co_mat ? "Đi học" : "Vắng"}</Space>
          );
        }}
      />
    </Table>
  );
};

export default TableDiemDanh;
