import {
  Button,
  Card,
  Input,
  Modal,
  Table,
  Tooltip,
  Typography,
  notification
} from "antd";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { AxiosError } from "axios";
import BaseResponsive from "@/components/base-responsive";
import type { ColumnsType } from "antd/es/table";
import DeleteDialog from "@/components/dialog/deleteDialog";
import EditorStudentDialog from "./sinh-vien-dialog";
import ImportExcelCompoment from "@/components/importDrawer";
import { Laravel400ErrorResponse } from "@/interface/axios/laravel";
import { Lop } from "@/interface/lop";
import ModalExport from "./modal-export";
import ModalExportExcel from "@/components/export/export-excel";
import { SiMicrosoftexcel } from "react-icons/si";
import { SinhVien } from "@/interface/user";
import { dealsWith } from "@/api/axios/error-handle";
import diemYThucApi from "@/api/lop/diemYThuc.api";
import exportApi from "@/api/export/export.api";
import importApi from "@/api/import.api";
import { useParams } from "react-router-dom";
import lopHocApi from "@/api/lop/lopHoc.api";

const { Title } = Typography;

const LopHocListSinhVienPage: FC<{ lop: Lop; lopAll?: Lop }> = ({
  lop,
  lopAll
}) => {
  const [api, contextholder] = notification.useNotification();
  const [isEdit, setIsEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEditor, setModalEditor] = useState(false);
  const [modalExport, setModalExport] = useState(false);
  const [modalExportDTT, setModalExportDTT] = useState(false);
  const [dataSelect, setDataSelect] = useState<SinhVien>();
  const [sinhVien, setSinhVien] = useState<SinhVien>();
  const [dataSource, setDataSource] = useState<SinhVien[]>([]);
  const [keyRender, setKeyRender] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalExportExcel, setModalExportExcel] = useState(false);
  const [modalExportSinhVien, setModalExportSinhVien] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { id } = useParams();
  // const [editingKey, setEditingKey] = useState("");
  // const isEditing = (record: SinhVien) => record.id === editingKey;
  // const edit = (record:SinhVien) => {
  //   setEditingKey(record.id);
  // };

  const getData = useCallback(async () => {
    setLoading(true);
    let items: SinhVien[] = [];
    try {
      const res = await lopHocApi.listSinhVien(lop.id);
      items = res.data.map((x) => ({
        ...x,
        stt: x.pivot ? x.pivot.stt : 0,
        nhom: x.pivot ? x.pivot.nhom : "",
        diem_y_thuc: x.pivot
          ? x.pivot.diem_y_thuc === null || x.pivot.diem_y_thuc === undefined
            ? 0
            : x.pivot.diem_y_thuc
          : 0,
        diem: x.pivot ? x.pivot.diem : 0
      }));
    } finally {
      setDataSource(items);
      setLoading(false);
    }
  }, [lop]);
  const dataDelete = (data: SinhVien) => {
    setSinhVien(data);
    setModalDelete(true);
  };
  const updateSV = (data: SinhVien) => {
    setIsEdit(true);
    setModalEditor(true);
    setDataSelect(data);
  };

  const handleSave = async () => {
    setLoadingUpdate(true);
    try {
      await diemYThucApi.editall(dataSource, lop.id);
      api.success({
        message: "Thành Công",
        description: "Thay đổi điểm ý thức của lớp thành công"
      });
      setKeyRender(Math.random());
    } catch (e) {
      const is_handle = dealsWith({
        "400": (e: any) => {
          const error = e as AxiosError<Laravel400ErrorResponse>;
          if (error.response)
            api.error({
              message: "Thất bại",
              description: error.response.data.message
            });
        }
      })(e);
      if (is_handle)
        api.error({
          message: "Thất bại",
          description: "Thay đổi điểm ý thức của lớp thất bại"
        });
    } finally {
      setLoadingUpdate(false);
      setOpenModal(false);
    }
    setOpenModal(false);
  };

  const handleDiemChange = (
    e: ChangeEvent<HTMLInputElement>,
    record: SinhVien
  ) => {
    const checkType = !isNaN(Number(e.target.value));
    if (
      checkType &&
      Number(e.target.value) <= 1 &&
      Number(e.target.value) >= -1
    ) {
      const updatedDataSource = [...dataSource];
      const updatedRecord = { ...record, diem_y_thuc: e.target.value };
      const index = updatedDataSource.findIndex(
        (item) => item.id === record.id
      );
      updatedDataSource[index] = updatedRecord;
      setDataSource(updatedDataSource);
    } else if (Number(e.target.value) > 1 || Number(e.target.value) < -1) {
      const updatedDataSource = [...dataSource];
      const updatedRecord = { ...record, diem_y_thuc: e.target.value };
      const index = updatedDataSource.findIndex(
        (item) => item.id === record.id
      );
      updatedDataSource[index] = updatedRecord;
      setDataSource(updatedDataSource);
      api.error({
        message: "Thất bại",
        description: "Giá trị không nằm trong phạm vi -1 đến 1"
      });
    } else if (!checkType) {
      const updatedDataSource = [...dataSource];
      const updatedRecord = { ...record, diem_y_thuc: e.target.value };
      const index = updatedDataSource.findIndex(
        (item) => item.id === record.id
      );
      updatedDataSource[index] = updatedRecord;
      setDataSource(updatedDataSource);

      api.error({
        message: "Thất bại",
        description: "Không nhập đúng định dạng"
      });
    }
  };
  const handleBlurDiemChange = (
    e: ChangeEvent<HTMLInputElement>,
    record: SinhVien
  ) => {
    e.target.classList.remove("text-orange-600");
    if (e.target.value.length == 0) {
      const updatedDataSource = [...dataSource];
      const updatedRecord = { ...record, diem_y_thuc: 0 };
      const index = updatedDataSource.findIndex(
        (item) => item.id === record.id
      );
      updatedDataSource[index] = updatedRecord;
      setDataSource(updatedDataSource);
    } else if (
      Number(e.target.value) > 1 ||
      Number(e.target.value) < -1 ||
      isNaN(Number(e.target.value))
    ) {
      const updatedDataSource = [...dataSource];
      const updatedRecord = { ...record, diem_y_thuc: e.target.value };
      const index = updatedDataSource.findIndex(
        (item) => item.id === record.id
      );
      updatedDataSource[index] = updatedRecord;
      setDataSource(updatedDataSource);

      e.target.classList.add("text-orange-600");
    }
  };

  const columns: ColumnsType<SinhVien> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt"
    },
    {
      title: "MSSV",
      dataIndex: "mssv",
      key: "mssv",
      filterSearch: true,
      onFilter: (value: any, record) => record.mssv?.startsWith(value)
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Lớp",
      dataIndex: "group",
      key: "group"
    },
    {
      title: "Nhóm",
      dataIndex: "nhom",
      key: "nhom"
    },
    {
      title: "Điểm ý thức",
      dataIndex: "diem_y_thuc",
      key: "diem_y_thuc",
      render: (_, record: SinhVien) => {
        return (
          <Input
            value={record.diem_y_thuc}
            onChange={(e) => handleDiemChange(e, record)}
            onBlur={(e) => handleBlurDiemChange(e, record)}
          />
        );
      }
    },
    {
      title: "Điểm chuyên cần",
      dataIndex: "diem",
      key: "diem"
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) =>
        ActionCellRender({ updateSV, dataDelete, data: record })
    }
  ];
  useEffect(() => {
    getData();
  }, [keyRender]);
  const contentDesktop = () => (
    <Table
      key={keyRender}
      loading={loading}
      columns={columns}
      className="danh_sach_sv"
      dataSource={dataSource}
      rowKey="id"
      pagination={false}
      scroll={{ y: 500 }}
    />
  );
  const contentMobile = () => (
    <div className="card-container card-diem-danh">
      {dataSource.map((record: SinhVien) => (
        <Card
          key={record.id}
          title={
            <>
              <strong className="card-diem-danh__title">STT : </strong>
              <span className="card-diem-danh__sub">{record.stt}</span>
            </>
          }
          actions={[
            <Button
              shape="circle"
              icon={<EditOutlined />}
              type="text"
              key="edit"
              onClick={() => updateSV(record)}
            />,
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              type="text"
              key="delete"
              onClick={() => dataDelete(record)}
            />
          ]}
        >
          <p>
            <strong>MSSV: </strong>
            {record.mssv}
          </p>
          <p>
            <strong>Tên: </strong>
            {record.name}
          </p>
          <p>
            <strong>Email: </strong>
            {record.email}
          </p>
          {record?.group && (
            <p>
              <strong>Lớp: </strong>
              {record.group}
            </p>
          )}
          {record?.nhom && (
            <p>
              <strong>Nhóm: </strong>
              {record.nhom}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
  return (
    <>
      {contextholder}
      <div className="mb-2 text-center">
        <Title className="pb-2" level={3}>
          Danh sách sinh viên
        </Title>
        <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
          <div className="flex flex-wrap items-center justify-start mt-2 gap-2">
            <Button type="primary" onClick={() => setModalExport(true)}>
              Xuất điểm danh pdf
            </Button>
            <Button type="primary" onClick={() => setModalExportDTT(true)}>
              Xuất danh sách pdf
            </Button>
            <Button type="primary" onClick={() => setModalExportExcel(true)}>
              Xuất điểm danh excel
            </Button>
            <Button type="primary" onClick={() => setModalExportSinhVien(true)}>
              Xuất sinh viên excel
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-start mt-2 gap-2">
            <div className="mx-1 my-2">
              <ImportExcelCompoment
                fieldName={[
                  { name: "stt" },
                  { name: "mssv" },
                  { name: "diem_y_thuc" }
                ]}
                fileDownloadName="giao_vien"
                downloadable={false}
                uploadType=" .xls,.xlsx"
                buttonElement={
                  <Button type="primary">Nhập điểm ý thức excel</Button>
                }
                appcectType={[
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel"
                ]}
                setKeyRender={setKeyRender}
                extraDownloadFileHeader={[{ keyName: "lop_id", value: id }]}
                translation="importExcel"
                uploadformApi={importApi.importDiemYThuc}
              />
            </div>

            <Button type="primary" onClick={() => setModalEditor(true)}>
              Thêm sinh viên
            </Button>
          </div>
        </div>
      </div>

      <BaseResponsive
        contentDesktop={contentDesktop}
        contentMobile={contentMobile}
      ></BaseResponsive>

      <EditorStudentDialog
        existStudent={dataSource}
        classId={lop.id}
        isEdit={isEdit}
        data={dataSelect}
        setEdit={setIsEdit}
        setKeyRender={setKeyRender}
        showModal={modalEditor}
        setShowModal={setModalEditor}
        lopAll={lopAll}
        lop={lop}
      />

      <DeleteDialog
        openModal={modalDelete}
        closeModal={setModalDelete}
        apiDelete={() =>
          lopHocApi.removeSV({ id: lop.id, sinh_vien_id: sinhVien?.id })
        }
        setKeyRender={setKeyRender}
        translation="sinh-vien-lop"
        name={sinhVien?.name}
      />
      <ModalExport
        apiExportAll={lopHocApi.exportLopLt}
        api={lopHocApi.exportStudent}
        translation="sinh-vien-lop"
        showModal={modalExport}
        setShowModal={setModalExport}
        text="Danh-sach-sinh-vien"
        data={lop}
      />
      <ModalExport
        apiExportAll={""}
        api={exportApi.diemThanhTich}
        translation="sinh-vien-lop"
        showModal={modalExportDTT}
        setShowModal={setModalExportDTT}
        text="Danh-sach"
        data={lop}
      />
      <ModalExportExcel
        translation="sinh-vien-lop"
        showModal={modalExportExcel}
        setShowModal={setModalExportExcel}
        api={exportApi.excelDiemDanh}
        data={lop}
        text="danh-sach-diem-danh"
      />
      <ModalExportExcel
        translation="sinh-vien-lop"
        showModal={modalExportSinhVien}
        setShowModal={setModalExportSinhVien}
        api={exportApi.excelSinhVien}
        data={lop}
        text="danh-sach-sinh-vien"
      />
      <div style={{ textAlign: "end", margin: "10px" }}>
        <Button
          type="primary"
          loading={loadingUpdate}
          onClick={() => setOpenModal(true)}
        >
          Lưu
        </Button>
      </div>

      <Modal
        centered
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => {
          handleSave();
        }}
        confirmLoading={loadingUpdate}
        className="relative"
        cancelText="Hủy"
        okText="Chỉnh sửa"
      >
        <div className="create-icon">
          <div>{<SiMicrosoftexcel />}</div>
        </div>

        <div className="modal-title-wapper">
          <p className="modal-title">Xác nhận</p>
          <p className="modal-suptitle">
            Bạn có chắc muốn chỉnh sửa điểm ý thức của lớp <b> </b> này không?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default LopHocListSinhVienPage;

const ActionCellRender: FC<any> = ({ updateSV, dataDelete, data }) => {
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
          onClick={() => updateSV(data)}
        />
      </Tooltip>
      <Tooltip title="Xoá">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          type="text"
          onClick={() => dataDelete(data)}
        />
      </Tooltip>
    </>
  );
};
