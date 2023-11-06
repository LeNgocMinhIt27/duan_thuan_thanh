import { dealsWith } from "@/api/axios/error-handle";
import diemDanhApi from "@/api/lop/diemDanh.api";
import LanDiemDanhApi from "@/api/lop/lanDiemDanh.api";
import { Laravel400ErrorResponse } from "@/interface/axios/laravel";
import { DiemDanhItem, LanDiemDanh, Lop } from "@/interface/lop";
import {
  Checkbox,
  Col,
  Row,
  Statistic,
  Table,
  notification,
  Card,
  Button,
  Modal
} from "antd";
import { ROLE_CODE } from "@/constant";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import TextArea from "antd/es/input/TextArea";
import Column from "antd/es/table/Column";
import { AxiosError } from "axios";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/stores/hook";
import { getAuthUser } from "@/stores/features/auth";
import { useMediaQuery } from "react-responsive";
import { SiMicrosoftexcel } from "react-icons/si";
const DiemDanhListSinhVien: FC<{ lan_diem_danh: LanDiemDanh; lop: Lop }> = ({
  lan_diem_danh,
  lop
}) => {
  const [api, contextholder] = notification.useNotification();
  const [key] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const authUser = useAppSelector(getAuthUser);
  const [dataSource, setDataSource] = useState<DiemDanhItem[]>([]);
  const getData = useCallback(async () => {
    setLoading(true);
    let items: DiemDanhItem[] = [];
    try {
      const res = await LanDiemDanhApi.listDiemDanh(lan_diem_danh.id, {
        lop_id: lop.id
      });
      items = res.data;
    } finally {
      setDataSource(items);
      setLoading(false);
    }
  }, [lan_diem_danh, lop]);
  useEffect(() => {
    getData();
  }, [key]);

  const onChangeCoMat = (e: CheckboxChangeEvent, record: DiemDanhItem) => {
    const updatedDataSource = [...dataSource];
    const updatedRecord = { ...record, co_mat: e.target.checked };
    const index = updatedDataSource.findIndex(
      (item) => item.diem_danh_id === record.diem_danh_id
    );
    updatedDataSource[index] = updatedRecord;
    setDataSource(updatedDataSource);
  };

  const onChangeGhiChu = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    record: DiemDanhItem
  ) => {
    const updatedDataSource = [...dataSource];
    const updatedRecord = { ...record, ghi_chu: e.target.value };
    const index = updatedDataSource.findIndex(
      (item) => item.diem_danh_id === record.diem_danh_id
    );
    updatedDataSource[index] = updatedRecord;
    setDataSource(updatedDataSource);
  };

  const changeDiemDanh = async () => {
    setLoadingUpdate(true);
    try {
      await diemDanhApi.editall(dataSource);
      api.success({
        message: "Thành Công",
        description: "Thay đổi điểm danh của lớp thành công"
      });
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
      if (!is_handle)
        api.error({
          message: "Thất bại",
          description: "Thay đổi ghi chú điểm danh thất bại"
        });
    } finally {
      setLoadingUpdate(false);
      setOpenModal(false);
    }
  };

  const isMobile = useMediaQuery({ minWidth: 600 });
  return (
    <>
      {contextholder}
      {authUser?.role_code === ROLE_CODE.TEACHER && (
        <Row align="middle" className="ngay-diem-danh">
          <Col xs={24} sm={24} md={12} lg={12}>
            <Statistic
              loading={loading}
              title={"Tổng số học sinh: "}
              value={dataSource.length}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Statistic
              loading={loading}
              title={"Số học sinh vắng mặt: "}
              value={dataSource.filter((x) => !x.co_mat).length}
            />
          </Col>
        </Row>
      )}
      {isMobile ? (
        <Table
          dataSource={dataSource}
          rowKey="diem_danh_id"
          pagination={false}
          loading={loading}
          scroll={{ y: 500 }}
        >
          <Column
            title="STT"
            dataIndex="stt"
            key="stt"
            width="8%"
            align="center"
          />
          <Column
            title="MSSV"
            dataIndex="mssv"
            key="mssv"
            width="10%"
            align="center"
          />
          <Column
            title="Tên sinh viên"
            dataIndex="name"
            key="name"
            width="10%"
            align="center"
          />
          <Column
            title="Lớp"
            dataIndex="group"
            key="group"
            width="10%"
            align="center"
          />
          <Column
            title="Có mặt"
            dataIndex="co_mat"
            key="co_mat"
            width="10%"
            render={(_: any, record: DiemDanhItem) => {
              return (
                <Checkbox
                  checked={record.co_mat}
                  onChange={(e) => onChangeCoMat(e, record)}
                  disabled={lan_diem_danh.is_qua_han}
                ></Checkbox>
              );
            }}
            align="center"
          />
          <Column
            title="Ghi chú"
            dataIndex="ghi_chu"
            key="ghi_chu"
            width="16.6%"
            render={(_: any, record: DiemDanhItem) => {
              return (
                <TextArea
                  rows={1}
                  disabled={lan_diem_danh.is_qua_han}
                  defaultValue={record.ghi_chu}
                  onChange={(e) => onChangeGhiChu(e, record)}
                />
              );
            }}
          />
        </Table>
      ) : (
        <div className="card-container card-chi-tiet-diem-danh">
          {dataSource.map((record) => (
            <Col span={24} key={record.diem_danh_id}>
              <Card
                title={
                  <>
                    <strong className="card-diem-danh__title">STT : </strong>
                    <span className="card-diem-danh__sub">{record.stt}</span>
                  </>
                }
                extra={
                  <Checkbox
                    checked={record.co_mat}
                    onChange={(e) => onChangeCoMat(e, record)}
                    disabled={lan_diem_danh.is_qua_han}
                  ></Checkbox>
                }
              >
                <p>
                  <strong>MSSV: </strong>
                  {record.mssv}
                </p>
                <p>
                  <strong>Tên sinh viên:</strong> {record.name}
                </p>
                <p>
                  <strong>Lớp:</strong> {record.group}
                </p>
                <TextArea
                  style={{ resize: "none" }}
                  rows={2}
                  disabled={lan_diem_danh.is_qua_han}
                  defaultValue={record.ghi_chu}
                  onChange={(e) => onChangeGhiChu(e, record)}
                />
              </Card>
            </Col>
          ))}
        </div>
      )}
      <Row align="middle" className="p-2">
        <Col span={24} className="flex flex-row-reverse">
          <Button
            type="primary"
            loading={loadingUpdate}
            onClick={() => setOpenModal(true)}
          >
            Lưu
          </Button>
        </Col>
      </Row>
      <Modal
        centered
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => {
          changeDiemDanh();
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
          <p className="modal-title">Điểm danh</p>
          <p className="modal-suptitle">
            Bạn có chắc muốn chỉnh sửa điểm danh của lớp <b> </b> này không?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default DiemDanhListSinhVien;
