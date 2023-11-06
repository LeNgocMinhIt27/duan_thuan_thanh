import { Button, Card, Col, Space, Table } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Lop, LopThi, LopThiSinhVien } from "@/interface/lop";
import { ROLE, SinhVien } from "@/interface/user";
import { DeleteOutlined } from "@ant-design/icons";
import AddStudent from "./modal-sinh-vien";
import Column from "antd/es/table/Column";
import { DiemItem } from "@/interface/bangdiem";
import LopThiApi from "@/api/lop/lopThi.api";
import { checkUserRoleAllowMultiple } from "@/interface/user/auth";
import lopHocApi from "@/api/lop/lopHoc.api";
import { useAppSelector } from "@/stores/hook";
import { useMediaQuery } from "react-responsive";
import DeleteDialog from "@/components/dialog/deleteDialog";

const BangDiemSinhVien: FC<{ lop_thi: LopThi; lop?: Lop }> = ({
  lop_thi,
  lop
}) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const [key] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DiemItem[]>([]);
  const [modalAddSV, setModalAddSV] = useState(false);
  const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);
  const [isSubset, setIsSubset] = useState(true);
  const [data, setData] = useState<LopThiSinhVien>();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [keyRender, setKeyRender] = useState(0);
  const hadPerssionAddSinhVien = useMemo(
    () =>
      currentUser &&
      checkUserRoleAllowMultiple(currentUser, [ROLE.admin, ROLE.assistant]),
    [currentUser]
  );

  const getSinhVien = async () => {
    try {
      if (!lop) return;
      const res = await lopHocApi.sinhVienLopHoc(lop.id);
      setSinhViens(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getData = useCallback(async () => {
    setLoading(true);
    let items: DiemItem[] = [];
    try {
      const res = await LopThiApi.listDiem(lop_thi.id, {
        with: "sinhVien"
      });
      items = res.data;
    } finally {
      setDataSource(items);
      setLoading(false);
    }
  }, [lop_thi, lop]);
  useEffect(() => {
    getData();
    if (hadPerssionAddSinhVien) getSinhVien();
  }, [key, lop_thi, keyRender]);
  const isMobile = useMediaQuery({ minWidth: 600 });

  useEffect(() => {
    const listSinhVienIds = sinhViens.map(
      (sinhVien: any) => sinhVien.sinh_vien_id
    );
    const sinhVienIds = dataSource.map((item: any) => item.sinh_vien_id);

    const isSubset = sinhVienIds.every((id: number) =>
      listSinhVienIds.includes(id)
    );
    setIsSubset(
      isSubset &&
        sinhVienIds?.length > 0 &&
        (listSinhVienIds?.length < sinhVienIds?.length ||
          listSinhVienIds?.length == sinhVienIds?.length)
    );
  }, [sinhViens, dataSource]);
  const onDeleteItem = (item: LopThiSinhVien) => {
    setData(item);
    setIsModalDelete(true);
  };

  return (
    <>
      {hadPerssionAddSinhVien && !isSubset ? (
        <Button className="mb-2" onClick={() => setModalAddSV(true)}>
          Thêm sinh viên
        </Button>
      ) : null}
      {isMobile ? (
        <Table
          dataSource={dataSource}
          rowKey="index"
          pagination={false}
          loading={loading}
        >
          <Column
            title="STT"
            dataIndex="stt"
            key="stt"
            width="10%"
            align="center"
          />
          <Column
            title="MSSV"
            dataIndex="mssv"
            key="mssv"
            width="15%"
            align="center"
          />
          <Column
            title="Tên sinh viên"
            dataIndex="name"
            key="name"
            width="15%"
            align="center"
          />
          <Column
            title="Điểm"
            dataIndex="diem"
            key="diem"
            width="15%"
            align="center"
          />
          <Column
            title="Hành động"
            key="action"
            width="20%"
            align="center"
            render={(_: any, record: LopThiSinhVien) => (
              <Space size="middle">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  type="text"
                  onClick={() => onDeleteItem(record)}
                />
              </Space>
            )}
          />
        </Table>
      ) : (
        <div className="card-container card-chi-tiet-diem-danh">
          {dataSource.length === 0 ? (
            <p>Không có dữ liệu thỏa mãn</p>
          ) : (
            dataSource.map((record: any) => (
              <Col span={24} key={record.diem_id}>
                <Card
                  key={record.diem_id}
                  title={
                    <>
                      <strong className="card-diem-danh__title">STT: </strong>
                      <span className="card-diem-danh__sub">{record.stt}</span>
                    </>
                  }
                  actions={[
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      type="text"
                      key="edit"
                      onClick={() => onDeleteItem(record)}
                    />
                  ]}
                >
                  <p>
                    <strong>MSSV:</strong> {record.mssv}
                  </p>
                  <p>
                    <strong>Tên sinh viên:</strong> {record.name}
                  </p>
                  <p>
                    <strong>Điểm:</strong> {record.diem}
                  </p>
                </Card>
              </Col>
            ))
          )}
        </div>
      )}

      {hadPerssionAddSinhVien && (
        <AddStudent
          showModal={modalAddSV}
          data={dataSource}
          setShowModal={setModalAddSV}
          existStudent={sinhViens}
          lop_thi_id={lop_thi.id}
          getData={getData}
          getSinhViens={getSinhVien}
        />
      )}
      <DeleteDialog
        openModal={isModalDelete}
        translation="sinh-vien"
        closeModal={setIsModalDelete}
        name="Sinh viên"
        apiDelete={() =>
          data &&
          LopThiApi.deleteSinhVien({
            ...data,
            loai: lop_thi.loai,
            lop_thi_id: lop_thi.id,
            ki_hoc: lop_thi.lop?.ki_hoc
          })
        }
        setKeyRender={setKeyRender}
      />
    </>
  );
};

export default BangDiemSinhVien;
