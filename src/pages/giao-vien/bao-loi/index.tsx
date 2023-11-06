import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useState } from "react";
import PageContainer from "@/Layout/PageContainer";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import BaseTable from "@/components/base-table";
import baoLoiApi from "@/api/bao-loi/baoLoi.api";
import { ColDef } from "ag-grid-community";
import { ActionField } from "@/interface/common";
import { BaoLoi } from "@/interface/bao-loi";
import DeleteDialog from "@/components/dialog/deleteDialog";
import EditDialog from "@/components/editDialog";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
  filter: true,
  floatingFilter: true
};

const BaoLoiPage = () => {
  const { t } = useTranslation("bao-loi");
  const [data, setData] = useState<BaoLoi>();
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const statusoption = [
    {
      value: "1",
      label: "Đã xử lý"
    },
    {
      value: "0",
      label: "Chưa xử lý"
    }
  ];

  const [columnDefs] = useState<ColDef<BaoLoi & ActionField>[]>([
    {
      headerName: t("field.sinh_vien_id"),
      field: "mssv",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ki_hoc"),
      field: "ki_hoc",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.lop_id"),
      field: "ma",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.lop_thi_id"),
      field: "ma_lop_thi",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.tieu_de"),
      field: "tieu_de",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.trang_thai"),
      field: "trang_thai",
      filter: SelectFilter,
      floatingFilterComponent: SelectFloatingFilterCompoment,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
        placeholder: "Trạng thái",
        data: statusoption
      },
      cellRenderer: (params: any) => {
        return params.value === 1 ? "Đã xử lý" : "Chưa xử lý";
      }
    },
    {
      headerName: t("field.action"),
      field: "action",
      pinned: "right",
      width: 150,
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onUpdateItem: (item: BaoLoi) => {
          setData(item);
          setIsModalEdit(true);
          setIsEdit(true);
        },
        onDeleteItem: (item: BaoLoi) => {
          setData(item);
          setIsModalDelete(true);
        }
      },
      filter: false
    }
  ]);
  const optionsEdit = [
    {
      type: "select",
      name: "trang_thai",
      placeholder: t("required.trang_thai"),
      label: t("hint.trang_thai"),
      children: [
        { value: "1", title: "Đã xử lý" },
        { value: "0", title: "Chưa xử lý" }
      ]
    }
  ];

  return (
    <>
      <PageContainer title="Quản lý báo lỗi">
        <BaseTable
          key={keyRender}
          columns={columnDefs}
          api={baoLoiApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <EditDialog
        apiEdit={baoLoiApi.edit}
        options={optionsEdit}
        translation={"bao-loi-sinh-vien"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
        onEditSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="bao-loi-sinh-vien"
        closeModal={setIsModalDelete}
        name={data?.tieu_de}
        apiDelete={() => data && baoLoiApi.delete(data)}
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default BaoLoiPage;

const ActionCellRender: FC<any> = ({ onUpdateItem, onDeleteItem, data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      <Tooltip title="Sửa">
        <Button
          shape="circle"
          icon={<EditOutlined />}
          type="text"
          onClick={() => onUpdateItem(data)}
        />
      </Tooltip>
      <Tooltip title="Xoá">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          type="text"
          onClick={() => onDeleteItem(data)}
        />
      </Tooltip>
    </>
  );
};
