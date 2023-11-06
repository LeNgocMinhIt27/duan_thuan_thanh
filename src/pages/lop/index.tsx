import { Button, Switch, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";

import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import { ColDef } from "ag-grid-community";
import DeleteDialog from "@/components/dialog/deleteDialog";
import EditorDialog from "./editor-dialog";
import { GiaoVien } from "@/interface/giaoVien";
import { Link } from "react-router-dom";
import { Lop } from "@/interface/lop";
import PageContainer from "@/Layout/PageContainer";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import filterAggridComponent from "@/components/custom-filter/filterAggridComponent";
import giaoVienApi from "@/api/user/giaoVien.api";
import kiHocApi from "@/api/kiHoc/kiHoc.api";
import lopHocApi from "@/api/lop/lopHoc.api";
import selectFilterGiaoVien from "@/components/custom-filter/selectFilterGiaoVien";
import { useTranslation } from "react-i18next";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: false,
  floatingFilter: true
};
const defaultParams = {
  with: "giaoViens"
};
const LopHocPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalEditor, setModalEditor] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("lop");
  const [data, setData] = useState<Lop>();
  const [kiHoc, setKihoc] = useState<string[]>([]);
  const [giaoVien, setGiaoVien] = useState<GiaoVien[]>([]);

  const [columnDefs, setColumDefs] = useState<ColDef<Lop & ActionField>[]>([]);
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
    const giao_vien_column: ColDef = {
      headerName: t("field.giao_vien"),
      field: "giaoViens",
      floatingFilter: true,
      filter: filterAggridComponent,
      cellRenderer: renderGiaoVien
    };
    if (giaoVien && giaoVien.length > 0) {
      (giao_vien_column.floatingFilterComponent = selectFilterGiaoVien),
        (giao_vien_column.floatingFilterComponentParams = {
          suppressFilterButton: true,
          placeholder: "Giảng viên",
          data: giaoVien.map((x) => ({
            name: x.name,
            id: x.id,
            email: x.email
          }))
        });
    }
    setColumDefs([
      ki_hoc_columns,
      {
        headerName: t("field.ma"),
        field: "ma",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.ma_kem"),
        field: "ma_kem",
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
      giao_vien_column,
      {
        headerName: t("field.loai"),
        field: "loai",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.tuan_hoc"),
        field: "tuan_hoc",
        filter: "agTextColumnFilter"
      },
      {
        headerName: t("field.is_dai_cuong"),
        field: "is_dai_cuong",
        filter: "agTextColumnFilter",
        cellRenderer: ActionCellRenderDaiCuong
      },
      {
        headerName: t("field.action"),
        field: "action",
        pinned: "right",
        width: 150,
        cellRenderer: ActionCellRender,
        cellRendererParams: {
          onUpdateItem: (item: Lop) => {
            setData(item);
            setIsEdit(true);
            setModalEditor(true);
          },
          onDeleteItem: (item: Lop) => {
            setData(item);
            setIsModalDelete(true);
          }
        },
        filter: false
      }
    ]);
  }, [kiHoc, giaoVien, t]);
  useEffect(() => {
    const getKyHoc = async () => {
      const res = await kiHocApi.list();
      if (res.data && res.data.length > 0) {
        setKihoc(res.data);
      }
    };
    const getGiaoVien = async () => {
      const res = await giaoVienApi.cache();
      if (res.data && res.data.length > 0) {
        setGiaoVien(res.data);
      }
    };
    getGiaoVien();
    getKyHoc();
  }, []);

  return (
    <>
      <PageContainer
        title="Quản lý lớp học"
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
          api={lopHocApi.list}
          key={keyRender}
          defaultParams={defaultParams}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <EditorDialog
        isEdit={isEdit}
        setEdit={setIsEdit}
        data={data}
        showModal={modalEditor}
        setShowModal={setModalEditor}
        setKeyRender={setKeyRender}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="lop"
        closeModal={setIsModalDelete}
        name={data?.ma}
        apiDelete={() => data && lopHocApi.delete(data)}
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default LopHocPage;

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
        <Link to={"" + data.id}>
          <Button shape="circle" type="text">
            <i className="fa-solid fa-chevron-right"></i>
          </Button>
        </Link>
      </Tooltip>
    </>
  );
};
const renderGiaoVien: FC<any> = ({ data }) => {
  if (!data) return <></>;
  if (!data.giao_viens) return <></>;
  return (
    <>
      {data.giao_viens?.map((item: GiaoVien) => (
        <Tag key={item.id}>{item.name}</Tag>
      ))}
    </>
  );
};
const ActionCellRenderDaiCuong: FC<any> = (data) => {
  return <Switch checked={data.data?.is_dai_cuong} />;
};
