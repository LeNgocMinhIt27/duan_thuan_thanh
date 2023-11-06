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
import giaoVienApi from "@/api/user/giaoVien.api";
import { GiaoVien } from "@/interface/giaoVien";

const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  filter: true,
  floatingFilter: true
};
const TeacherManagementPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const { t } = useTranslation("giao-vien");
  const [data, setData] = useState<GiaoVien>();
  const [columnDefs] = useState<ColDef<GiaoVien & ActionField>[]>([
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
      headerName: t("field.action"),
      field: "action",
      pinned: "right",
      width: 150,
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onUpdateItem: (item: GiaoVien) => {
          setData(item);
          setIsModalEdit(true);
          setIsEdit(true);
        },
        onDeleteItem: (item: GiaoVien) => {
          setData(item);
          setIsModalDelete(true);
        }
      },
      filter: false
    }
  ]);
  const optionsCreate = [
    {
      type: "input",
      name: "name",
      placeholder: t("required.ten"),
      label: t("hint.ten"),
      rule: [
        {
          require: true,
          message: t("required.ten")
        }
      ]
    },
    {
      type: "input",
      name: "email",
      placeholder: t("required.email"),
      label: t("hint.email"),
      rule: [
        {
          require: true,
          message: t("required.email")
        }
      ]
    },
    {
      type: "password",
      name: "password",
      placeholder: t("required.password"),
      label: t("hint.password"),
      rule: [
        {
          require: true,
          message: t("required.password")
        }
      ]
    },
    {
      type: "password",
      name: "confirm",
      placeholder: t("required.confirmPass"),
      label: t("hint.confirmPass"),
      dependencies: "password",
      rule: [
        {
          require: true,
          message: t("required.confirmPass")
        },
        ({ getFieldValue }: any) => ({
          validator(_: any, value: any) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(t("message.not_confirm")));
          }
        })
      ]
    }
  ];
  const optionsEdit = [
    {
      type: "input",
      name: "name",
      placeholder: t("required.ten"),
      label: t("hint.ten"),
      rule: [
        {
          require: true,
          message: t("required.ten")
        }
      ]
    },
    {
      type: "input",
      name: "email",
      placeholder: t("required.email"),
      label: t("hint.email"),
      rule: [
        {
          require: true,
          message: t("required.email")
        }
      ]
    }
  ];
  return (
    <>
      <PageContainer
        title="Quản lý giảng viên"
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
          api={giaoVienApi.list}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <CreateNEditDialog
        apiCreate={giaoVienApi.create}
        apiEdit={giaoVienApi.edit}
        options={isEdit == true ? optionsEdit : optionsCreate}
        translation={"giao-vien"}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setKeyRender={setKeyRender}
        openModal={isModalEdit}
        closeModal={setIsModalEdit}
      />
      <DeleteDialog
        openModal={isModalDelete}
        translation="giao-vien"
        closeModal={setIsModalDelete}
        name={data?.name}
        apiDelete={() => data && giaoVienApi.delete(data)}
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default TeacherManagementPage;

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
