import { EditOutlined } from "@ant-design/icons";
import { FC, useState } from "react";
import BaseTable from "@/components/base-table";
import { Button } from "antd";
import { ColDef } from "ag-grid-community";
import PageContainer from "@/Layout/PageContainer";
import { useTranslation } from "react-i18next";
import CreateNEditDialog from "@/components/createNEditDialog";
import { ActionField } from "@/interface/common";
import phucKhaoAdminApi from "@/api/phucKhao/phucKhao.api";
import { PhucKhao } from "@/interface/phucKhao";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const PhucKhaoListPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("phuc-khao");
  const [data, setData] = useState<PhucKhao>();
  const [columnDefs] = useState<ColDef<PhucKhao & ActionField>[]>([
    {
      headerName: t("field.name"),
      field: "sinh_viens.name",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.email"),
      field: "sinh_viens.email",
      filter: "agTextColumnFilter"
    },

    {
      headerName: t("field.mssv"),
      field: "sinh_viens.mssv",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ma_lop"),
      field: "lops.ma_lop",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.ma_lop_thi"),
      field: "lop_this.ma",
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
      filter: "agTextColumnFilter"
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
  const options = [
    {
      type: "select",
      name: "trang_thai",
      placeholder: "Chọn trạng thái",
      label: "Trạng thái",
      children: [
        { title: "Chưa xử lý", value: "Chưa xử lý" },
        { title: "Đã xử lý", value: "Đã xử lý" }
      ]
    }
  ];
  return (
    <>
      <PageContainer
        title="Quản lý phúc khảo"
        // extraTitle={
        //   <Space style={{ float: "right" }}>
        //     <Button onClick={() => setIsModalEdit(true)} type="primary">
        //       {t("action.create_new")}
        //     </Button>
        //   </Space>
        // }
      >
        <BaseTable
          key={keyRender}
          columns={columnDefs}
          api={phucKhaoAdminApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <CreateNEditDialog
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
      />
    </>
  );
};

export default PhucKhaoListPage;

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
