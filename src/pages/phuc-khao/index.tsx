import { Button, Space, Tag } from "antd";
import { FC, useEffect, useState } from "react";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import { ColDef } from "ag-grid-community";
// const { Option } = Select;
// import CreateNEditDialog from "@/components/createNEditDialog";
// import DeleteDialog from "@/components/dialog/deleteDialog";
import EditDialog from "@/components/editDialog";
import { EditOutlined } from "@ant-design/icons";
import ModalExportPK from "@/components/export/export-excel-phucKhao";
import PageContainer from "@/Layout/PageContainer";
import { PhucKhao } from "@/interface/phucKhao";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import exportApi from "@/api/export/export.api";
import phucKhaoApi from "@/api/phucKhao/phucKhao.api";
// import * as XLSX from "xlsx";
import { sdk } from "@/api/axios";
import { useTranslation } from "react-i18next";

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
  filter: true,
  floatingFilter: true
};

const PhucKhaoPage = () => {
  const { t } = useTranslation("phuc-khao");
  const [data, setData] = useState<PhucKhao>();
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  // const [isModalDelete, setIsModalDelete] = useState(false);
  const [modalExportPhucKhao, setModalExportPhucKhao] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const statusoption = [
    {
      value: "da_thanh_toan",
      label: "Đã thanh toán"
    },
    {
      value: "chua_thanh_toan",
      label: "Chưa thanh toán"
    }
  ];

  const [columnDefs] = useState<ColDef<PhucKhao & ActionField>[]>([
    {
      headerName: t("field.mssv"),
      field: "sinh_vien.mssv",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ki_hoc"),
      field: "ki_hoc",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ma_lop"),
      field: "lop.ma",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ma_lop_thi"),
      field: "lop_thi.ma",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ma_thanh_toan"),
      field: "ma_thanh_toan",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.trang_thai"),
      field: "trang_thai",
      filter: SelectFilter,
      cellRenderer: TrangThaiCellRender,
      floatingFilterComponent: SelectFloatingFilterCompoment,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
        placeholder: "Trạng thái",
        data: statusoption
      }
    },
    {
      headerName: t("field.action"),
      field: "action",
      pinned: "right",
      width: 150,
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onUpdateItem: (item: PhucKhao) => {
          setData(item);
          setIsModalEdit(true);
          setIsEdit(true);
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
      required: true,
      children: [
        { value: "da_thanh_toan", title: "Đã thanh toán" },
        { value: "chua_thanh_toan", title: "Chưa thanh toán" }
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("t");
        if (!token) {
          return;
        }
        const response = await sdk.post("admin/phuc-khao");
        setData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await sdk.post("admin/phuc-khao");

    setData(response.data);
  };

  return (
    <>
      <PageContainer
        title="Quản lý phúc khảo"
        extraTitle={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setModalExportPhucKhao(true)} type="primary">
              Xuất danh sách
            </Button>
          </Space>
        }
      >
        <BaseTable
          key={keyRender}
          columns={columnDefs}
          api={phucKhaoApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <EditDialog
        apiEdit={phucKhaoApi.edit}
        options={optionsEdit}
        translation={"phuc-khao"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        // closeModal={setIsModalEdit}
        closeModal={() => {
          setIsModalEdit(false);
          fetchData();
        }}
        onEditSuccess={() => {
          fetchData();
        }}
      />
      <ModalExportPK
        translation="sinh-vien-lop"
        showModal={modalExportPhucKhao}
        setShowModal={setModalExportPhucKhao}
        api={exportApi.excelPhucKhao}
        data={data}
        text="danh-sach-phuc-khao"
      />
      {/* <DeleteDialog
        openModal={isModalDelete}
        translation="bao-loi"
        closeModal={setIsModalDelete}
        // name={data?.tieu_de}
        // apiDelete={() => data && phucKhaoApi.delete(data)}
        setKeyRender={setKeyRender}
      /> */}
    </>
  );
};

export default PhucKhaoPage;

const ActionCellRender: FC<any> = ({ onUpdateItem, data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      <Button
        shape="circle"
        icon={<EditOutlined />}
        type="text"
        onClick={() => onUpdateItem(data)}
      />
    </>
  );
};

const TrangThaiCellRender: FC<{ data: PhucKhao }> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  switch (data.trang_thai) {
    case "da_thanh_toan":
      return <Tag key="da_thanh_toan">Đã thanh toán</Tag>;
    case "chua_thanh_toan":
      return <Tag key="da_thanh_toan">Chưa thanh toán</Tag>;
  }
};
