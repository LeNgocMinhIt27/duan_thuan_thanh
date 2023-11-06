import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FC, useState } from "react";
import BaseTable from "@/components/base-table";
import { Button, Space, Tooltip } from "antd";
import { ColDef } from "ag-grid-community";
import PageContainer from "@/Layout/PageContainer";
import { useTranslation } from "react-i18next";
import CreateNEditDialog from "@/components/createNEditDialog";
import DeleteDialog from "@/components/dialog/deleteDialog";
import { ActionField } from "@/interface/common";
import { sinhVienApi } from "@/api/user/sinhvien.api";
import { SinhVien } from "@/interface/user";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import moment from "moment";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const SinhVienPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("sinh-vien");
  const [data, setData] = useState<SinhVien>();
  const [columnDefs] = useState<ColDef<SinhVien & ActionField>[]>([
    {
      headerName: t("field.name"),
      field: "name",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.email"),
      field: "email",
      filter: "agTextColumnFilter"
    },

    {
      headerName: t("field.mssv"),
      field: "mssv",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.birthday"),
      field: "birthday",
      filter: "agDateColumnFilter",
      cellRenderer: (x: any) => {
        return DateFormat(x.data, "birthday");
      }
    },
    {
      headerName: t("field.group"),
      field: "group",
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.action"),
      field: "action",
      pinned: "right",
      width: 200,
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onUpdateItem: (item: SinhVien) => {
          const res = Object.assign({}, item);
          if (item.birthday) {
            res.birthday = dayjs(item.birthday).tz("Asia/Ho_Chi_Minh");
          }
          setData(res);
          setIsModalEdit(true);
          setIsEdit(true);
        },
        onDeleteItem: (item: SinhVien) => {
          setData(item);
          setIsModalDelete(true);
        }
      },
      filter: false
    }
  ]);
  const options = [
    {
      type: "input",
      name: "name",
      placeholder: "Nhập tên",
      label: "Tên",
      rule: [
        {
          required: true,
          message: t("required.name")
        }
      ]
    },
    {
      type: "input",
      name: "email",
      placeholder: "Nhập email",
      label: "Email"
    },
    {
      type: "input",
      name: "mssv",
      placeholder: "Nhập mã sinh viên",
      label: "MSSV",
      rule: [
        {
          required: true,
          message: t("required.mssv")
        }
      ]
    },
    {
      type: "datepicker",
      name: "birthday",
      placeholder: "Ngày Sinh",
      label: "Ngày Sinh",
      timeFomat: "DD/MM/YYYY"
    },
    {
      type: "input",
      name: "group",
      placeholder: "Lớp",
      label: "Lớp"
    }
  ];
  return (
    <>
      <PageContainer
        title="Quản lý sinh viên"
        extraTitle={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setIsModalEdit(true)} type="primary">
              {t("action.create_new")}
            </Button>
          </Space>
        }
      >
        <BaseTable
          key={keyRender}
          columns={columnDefs}
          api={sinhVienApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <CreateNEditDialog
        apiCreate={sinhVienApi.create}
        apiEdit={sinhVienApi.edit}
        options={options}
        translation={"sinh-vien"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="sinh-vien"
        closeModal={setIsModalDelete}
        name={data?.name}
        apiDelete={() => data && sinhVienApi.delete(data)}
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default SinhVienPage;

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

const DateFormat: FC<any> = (data) => {
  if (!data) {
    return <span></span>;
  }
  if (!data.birthday) {
    return <span></span>;
  }
  const formattedDate = moment(data.birthday).format("DD/MM/YYYY");
  return <>{<span>{formattedDate}</span>}</>;
};
