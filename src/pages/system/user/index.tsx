import { FC, useState } from "react";
import { type ColDef } from "ag-grid-community";
import { Button, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { ActionField } from "@/interface/common";
import BaseTable from "@/components/base-table";
import PageContainer from "@/Layout/PageContainer";
import { User } from "@/interface/user/user";
import userApi from "@/api/admin/user.api";
import { useTranslation } from "react-i18next";
// import { format } from "date-fns";
import DeleteDialog from "@/components/dialog/deleteDialog";
import CreateUser from "./createUser";
import UpdateUser from "./updateUser";
import SelectFloatingFilterCompoment from "@/components/custom-filter/SelectFloatingFilterCompoment";
import SelectFilter from "@/components/custom-filter/SelectFilter";
import ResetPassword from "./reset-password";

const defaultColDef = {
  flex: 1,
  resizable: true,
  floatingFilter: true,
  filterParams: {
    buttons: ["reset", "apply"]
  }
};

const roleoption = [
  {
    value: "admin",
    label: "Quản trị"
  },
  {
    value: "assistant",
    label: "Trợ lý"
  },
  {
    value: "teacher",
    label: "Giảng viên"
  },
  {
    value: "student",
    label: "Sinh viên"
  }
];
const UserPage: React.FC = () => {
  const { t } = useTranslation("user-manager-modal");
  const [statusModalDelete, setStatusModalDelete] = useState(false);
  const [valueSelected, setValueSelected] = useState<any>({
    role_code: "admin"
  });
  const [createUserModal, setCreatUserModal] = useState(false);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [resetModel, setResetModel] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const [columnDefs] = useState<ColDef<User & ActionField>[]>([
    {
      headerName: t("field.username"),
      field: "username",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: t("field.role_code"),
      field: "role_code",
      filter: SelectFilter,
      floatingFilter: true,
      cellRenderer: RoleCellRender,
      floatingFilterComponent: SelectFloatingFilterCompoment,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
        placeholder: "Vai trò",
        data: roleoption
      }
    },
    {
      headerName: t("field.action"),
      field: "action",
      pinned: "right",
      width: 150,
      filter: false,
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onUpdateItem: (item: User) => {
          setValueSelected(item);
          setUpdateUserModal(true);
          setIsEdit(true);
        },
        onDeleteItem: (item: User) => {
          setValueSelected(item);
          setStatusModalDelete(true);
        },
        onResetPassword: (item: User) => {
          setValueSelected(item);
          setResetModel(true);
        }
      }
    }
  ]);

  return (
    <>
      <PageContainer
        titleTrans="accountManagement.title"
        extraTitle={
          <Button
            type="primary"
            onClick={() => {
              setCreatUserModal(true);
            }}
            style={{ float: "right", height: "2.5rem" }}
          >
            {t("action.create_new")}
          </Button>
        }
      >
        <BaseTable
          columns={columnDefs}
          api={userApi.list}
          key={keyRender}
          gridOption={{ defaultColDef: defaultColDef }}
        ></BaseTable>
      </PageContainer>
      <CreateUser
        showModal={createUserModal}
        setShowModal={setCreatUserModal}
        setKeyRender={setKeyRender}
      ></CreateUser>
      <UpdateUser
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        showModal={updateUserModal}
        setShowModal={setUpdateUserModal}
        data={valueSelected}
        setKeyRender={setKeyRender}
      ></UpdateUser>
      <DeleteDialog
        openModal={statusModalDelete}
        translation="user-manager-modal"
        closeModal={setStatusModalDelete}
        name={valueSelected?.username}
        apiDelete={() => valueSelected && userApi.delete(valueSelected)}
        setKeyRender={setKeyRender}
      />
      <ResetPassword
        showModal={resetModel}
        setShowModal={setResetModel}
        data={valueSelected}
      />
    </>
  );
};
export default UserPage;

const ActionCellRender: FC<any> = ({
  onUpdateItem,
  onDeleteItem,
  data,
  onResetPassword
}) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      <Tooltip title="Tải lại">
        <Button
          shape="circle"
          type="text"
          icon={<ReloadOutlined />}
          onClick={() => onResetPassword(data)}
        ></Button>
      </Tooltip>
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
const RoleCellRender: FC<any> = ({ data }) => {
  if (!data) {
    return <span></span>;
  }
  return (
    <>
      {data.roles.map((role: string) => {
        switch (role) {
          case "teacher":
            return <Tag key="teacher">Giảng viên</Tag>;
          case "admin":
            return <Tag key="admin">Quản trị</Tag>;
          case "assistant":
            return <Tag key="assistant">Trợ lý</Tag>;
          case "student":
            return <Tag key="student">Sinh viên</Tag>;
        }
      })}
    </>
  );
};
