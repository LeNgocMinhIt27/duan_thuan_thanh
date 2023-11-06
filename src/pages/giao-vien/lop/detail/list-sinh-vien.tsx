import exportApi from "@/api/export/export.api";
import importApi from "@/api/import.api";
import diemYThucApi from "@/api/lop/diemYThuc.api";
import lopCuaGiaoVienApi from "@/api/lop/lopCuaGiaoVien.api";
import lopHocApi from "@/api/lop/lopHoc.api";
import ModalExportExcel from "@/components/export/export-excel";
import ImportExcelCompoment from "@/components/importDrawer";
import { Lop } from "@/interface/lop";
import { SinhVien } from "@/interface/user";
import ModalExport from "@/pages/lop/detail/modal-export";
import { Table, Card, Col, Button, Input, notification, Modal } from "antd";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { dealsWith } from "@/api/axios/error-handle";
import { AxiosError } from "axios";
import { Laravel400ErrorResponse } from "@/interface/axios/laravel";
import { SiMicrosoftexcel } from "react-icons/si";

const LopHocListSinhVienPage: FC<{ lop: Lop }> = ({ lop }) => {
  const [dataSource, setDataSource] = useState<SinhVien[]>([]);
  const [key] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalExport, setModalExport] = useState(false);
  const [modalExportExcel, setModalExportExcel] = useState(false);
  const [modalExportSinhVien, setModalExportSinhVien] = useState(false);
  const [modalExportDTT, setModalExportDTT] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [api, contextholder] = notification.useNotification();
  const { id } = useParams();
  const [keyRender, setKeyRender] = useState(0);

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
  const columns = [
    {
      title: "Stt",
      dataIndex: "stt",
      key: "stt"
    },
    {
      title: "MSSV",
      dataIndex: "mssv",
      key: "mssv"
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name"
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
      render: (_: any, record: SinhVien) => {
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
    }
  ];

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
          description: "Thay đổi ghi chú điểm danh thất bại"
        });
    } finally {
      setLoadingUpdate(false);
      setOpenModal(false);
    }
    setOpenModal(false);
  };

  const getData = useCallback(async () => {
    setLoading(true);
    let items: SinhVien[] = [];
    try {
      const res = await lopCuaGiaoVienApi.listSinhVien(lop.id);
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
  useEffect(() => {
    getData();
  }, [key, keyRender]);
  const isMobile = useMediaQuery({ minWidth: 600 });
  return (
    <>
      {contextholder}
      <div className="flex flex-wrap items-center justify-between mt-2 gap-2 mb-4">
        <div className="flex justify-start flex-wrap gap-2 ">
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
        <div className="">
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
      </div>
      {isMobile ? (
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ y: 500 }}
        />
      ) : (
        <div className="card-container card-chi-tiet-diem-danh">
          {dataSource.map((record: SinhVien) => (
            <Col span={24} key={record.id}>
              <Card
                className="custom-card"
                title={
                  <>
                    <strong className="card-chi-tiet-diem-danh__title">
                      Stt :
                    </strong>
                    <span className="card-chi-tiet-diem-danh__sub">
                      {record.stt}
                    </span>
                  </>
                }
              >
                <></>
                <p>
                  <strong>MSSV : </strong> {record.mssv}
                </p>
                <p>
                  <strong>Tên : </strong> {record.name}
                </p>
                {record.group ? (
                  <p>
                    <strong>Lớp : </strong> {record.group}
                  </p>
                ) : null}
                {record.group ? (
                  <p>
                    <strong>Nhóm : </strong> {record.nhom}
                  </p>
                ) : null}
              </Card>
            </Col>
          ))}
        </div>
      )}
      <ModalExport
        translation="sinh-vien-lop"
        showModal={modalExport}
        setShowModal={setModalExport}
        data={lop}
        text="Danh-sach-sinh-vien"
        apiExportAll={""}
        api={lopHocApi.exportStudent}
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

      <ModalExportExcel
        translation="sinh-vien-lop"
        showModal={modalExportSinhVien}
        setShowModal={setModalExportSinhVien}
        api={exportApi.excelSinhVien}
        data={lop}
        text="danh-sach-sinh-vien"
      />
    </>
  );
};

export default LopHocListSinhVienPage;
