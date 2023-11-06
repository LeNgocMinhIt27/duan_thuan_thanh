import { Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import DeleteDialog from "@/components/dialog/deleteDialog";
import EditorDialog from "./editor-dialog";
import { LopThi } from "@/interface/lop";

import PageContainer from "@/Layout/PageContainer";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";

import kiHocApi from "@/api/kiHoc/kiHoc.api";
import lopThiApi from "@/api/lop/lopThi.api";
import { useTranslation } from "react-i18next";
import { useLoaiLopThi } from "@/hooks/useLoaiLopThi";
import { Link } from "react-router-dom";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: false,
  floatingFilter: true
};
const LopThiPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalEditor, setModalEditor] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("lop-thi");
  const [data, setData] = useState<LopThi>();
  const [kiHoc, setKihoc] = useState<string[]>([]);
  const { items: dotThi, format: formatDotThi } = useLoaiLopThi();

  const [columnDefs, setColumDefs] = useState<ColDef<LopThi & ActionField>[]>(
    []
  );
  useEffect(() => {
    const ki_hoc_columns: ColDef = {
      headerName: t("field.ki_hoc"),
      field: "ki_hoc",
      filter: SelectFilter,
      floatingFilter: true
    };
    if (kiHoc && kiHoc.length > 0) {
      ki_hoc_columns.floatingFilterComponent = SelectFloatingFilterCompoment;
      ki_hoc_columns.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Kỳ học",
        data: kiHoc.map((x) => ({
          label: x,
          value: x
        }))
      };
    }

    const loai_columns: ColDef = {
      headerName: t("field.loai"),
      field: "loai",
      filter: SelectFilter,
      floatingFilter: true,
      cellRenderer: loaiCellRenderer
    };

    if (dotThi && dotThi.length > 0) {
      loai_columns.floatingFilterComponent = SelectFloatingFilterCompoment;
      loai_columns.floatingFilterComponentParams = {
        suppressFilterButton: true,
        placeholder: "Đợt thi",
        data: dotThi.map((x) => ({
          label: x.title,
          value: x.value
        }))
      };
      loai_columns.cellRendererParams = {
        format: formatDotThi
      };
    }

    setColumDefs([
      ki_hoc_columns,
      {
        headerName: t("field.ma_lop_hoc"),
        field: "ma_lop",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_hp"),
        field: "ma_hp",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ten_hp"),
        field: "ten_hp",
        filter: "agTextColumnFilter"
      },

      {
        headerName: t("field.ma_lop_thi"),
        field: "ma_lop_thi",
        filter: "agTextColumnFilter"
      },
      loai_columns,
      {
        headerName: t("field.action"),
        field: "action",
        pinned: "right",
        width: 150,
        cellRenderer: ActionCellRender,
        cellRendererParams: {
          onUpdateItem: (item: LopThi) => {
            setData(item);
            setIsEdit(true);
            setModalEditor(true);
          },
          onDeleteItem: (item: LopThi) => {
            setData(item);
            setIsModalDelete(true);
          }
        },
        filter: false
      }
    ]);
  }, [kiHoc, dotThi]);

  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };

    getKyHoc();
  }, []);

  return (
    <>
      <PageContainer
        title="Quản lý lớp thi"
        extraTitle={
          <Button
            onClick={() => setModalEditor(true)}
            type="primary"
            style={{ float: "right" }}
          >
            {t("action.create_new")}
          </Button>
        }
      >
        <BaseTable
          columns={columnDefs}
          api={lopThiApi.listAgGrid}
          key={keyRender}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      {modalEditor && (
        <EditorDialog
          isEdit={isEdit}
          setEdit={setIsEdit}
          data={data}
          showModal={modalEditor}
          setShowModal={setModalEditor}
          setKeyRender={setKeyRender}
        />
      )}
      {isModalDelete && (
        <DeleteDialog
          openModal={isModalDelete}
          translation="lop-thi"
          closeModal={setIsModalDelete}
          name={data?.ma_lop_thi}
          apiDelete={() => data && lopThiApi.delete(data)}
          setKeyRender={setKeyRender}
        />
      )}
    </>
  );
};

export default LopThiPage;

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
      <Tooltip title="Chi tiết">
        <Link to={"/sohoa/lop-hoc/" + data.lop_id + "/sinh-vien/" + data.id}>
          <Button shape="circle" type="text">
            <i className="fa-solid fa-chevron-right"></i>
          </Button>
        </Link>
      </Tooltip>
    </>
  );
};

export interface LoaiCellRendererParams extends ICellRendererParams {
  format: (value: string) => string;
}
const loaiCellRenderer: FC<LoaiCellRendererParams> = (params) => {
  if (!params.value) {
    return "";
  }
  return params.format(params.value);
};
