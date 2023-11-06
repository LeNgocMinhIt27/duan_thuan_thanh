import { FC, useState } from "react";
import BaseTable from "@/components/base-table";
import { Tag } from "antd";
import { ColDef } from "ag-grid-community";
import PageContainer from "@/Layout/PageContainer";
import { ActionField } from "@/interface/common";
import { TinNhan } from "@/interface/tinNhan";
import tinNhanAdminApi from "@/api/tinNhan/tinNhanAdmin.api";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import moment from "moment";
const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const PhucKhaoListPage = () => {
  const statusoption = [
    {
      value: 0,
      label: "Chưa thanh toán"
    },
    {
      value: 1,
      label: "Đã thanh toán"
    }
  ];
  const [columnDefs] = useState<ColDef<TinNhan & ActionField>[]>([
    {
      headerName: "Tin nhắn",
      field: "tin_nhan",
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Phí",
      field: "gia",
      filter: "agTextColumnFilter"
    },

    {
      headerName: "Mã chuyển khoản",
      field: "ma_thanh_toan",
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Thời gian nhận",
      field: "ngay_nhan",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      headerName: "Thời gian gửi",
      field: "created_at",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      headerName: "Thời gian cập nhật",
      field: "updated_at",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      headerName: "Trạng thái",
      field: "trang_thai",
      filter: SelectFilter,
      floatingFilter: true,
      cellRenderer: StatusCellRender,
      floatingFilterComponent: SelectFloatingFilterCompoment,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
        placeholder: "Trạng thái",
        data: statusoption
      }
    }
  ]);

  return (
    <>
      <PageContainer title="Quản lý tin nhắn">
        <BaseTable
          columns={columnDefs}
          api={tinNhanAdminApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      {/* <CreateNEditDialog
        apiCreate={phucKhaoAdminApi.edit}
        apiEdit={phucKhaoAdminApi.edit}
        options={options}
        translation={"sinh-vien"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
      /> */}
    </>
  );
};

export default PhucKhaoListPage;

const StatusCellRender: FC<any> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      <Tag key={data?.trang_thai}>
        {data?.trang_thai == 0 ? "Chưa thanh toán" : "Đã thanh toán"}
      </Tag>
    </>
  );
};

const formatDate = (date: any) => {
  if (!date) return "";
  return moment(date).format("DD/MM/YYYY");
};
