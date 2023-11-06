import PageContainer from "@/Layout/PageContainer";
import { Lop } from "@/interface/lop";
import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import LopHocDetailInfoPage from "./info";
import { Button, Col, Row, Tabs, Typography } from "antd";
import LopHocListSinhVienPage from "./list-sinh-vien";
import { useAppDispatch } from "@/stores/hook";
import { setHeightAuto } from "@/stores/features/config";
import LopHocListDiemDanhPage from "./list-diem-danh";
import ModalExport from "./modal-export";
import ListLopThiPage from "./list-lop-thi";
import ModalExportExcel from "@/components/export/export-excel";
import exportApi from "@/api/export/export.api";
import lopHocApi from "@/api/lop/lopHoc.api";

const { Title } = Typography;

const LopHocDetailPage = () => {
  const dispatch = useAppDispatch();
  const lop = useLoaderData() as Lop;
  const [modalExport, setModalExport] = useState(false);
  const [modalExportDiemDanh, setModalExportDiemDanh] = useState(false);
  const [modalExportSinhVien, setModalExportSinhVien] = useState(false);
  const [modalDiemThanhTich, setModalExportDiemThanhTich] = useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      { router: "../", text: "Danh sách lớp học" },
      { text: lop.ten_hp },
      { text: lop.ma }
    ];
  }, [lop]);
  const isHasChild = !!lop.children && lop.children.length > 0;
  const tabs = useMemo(() => {
    if (!lop.children) {
      return [];
    }
    return lop.children.map((x) => ({
      key: x.ma,
      label: x.ma,
      children: <LopHocListSinhVienPage lop={x} lopAll={lop} />
    }));
  }, [isHasChild, lop]);
  useEffect(() => {
    dispatch(setHeightAuto(true));
    return () => {
      dispatch(setHeightAuto(false));
    };
  });
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <Row className="full-width p-2">
        <Col span={24} className="px-4">
          <Title level={3} className="text-center">
            Thông tin
          </Title>
          <LopHocDetailInfoPage lop={lop}></LopHocDetailInfoPage>
        </Col>
        <Col span={24} className="py-4">
          <LopHocListDiemDanhPage lop={lop} />
        </Col>
        {!isHasChild && (
          <Col span={24} className="py-4">
            <ListLopThiPage lop={lop} />
          </Col>
        )}
        <Col className="py-4" span={24}>
          {isHasChild && (
            <div className="flex flex-wrap gap-2">
              <Button type="primary" onClick={() => setModalExport(true)}>
                Xuất toàn bộ điểm danh pdf
              </Button>
              <Button
                type="primary"
                onClick={() => setModalExportDiemThanhTich(true)}
              >
                Xuất toàn bộ danh sách pdf
              </Button>
              <Button
                type="primary"
                onClick={() => setModalExportDiemDanh(true)}
              >
                Xuất toàn bộ điểm danh excel
              </Button>
              <Button
                type="primary"
                onClick={() => setModalExportSinhVien(true)}
              >
                Xuất toàn bộ sinh viên excel
              </Button>
            </div>
          )}

          {isHasChild ? (
            <Tabs defaultActiveKey="1" items={tabs} />
          ) : (
            <LopHocListSinhVienPage lop={lop} />
          )}
        </Col>
      </Row>
      <ModalExport
        apiExportAll={lopHocApi.exportLopLt}
        api={""}
        showModal={modalExport}
        setShowModal={setModalExport}
        exportAll={true}
        data={lop}
        translation="sinh-vien-lop"
        text="Danh-sach-sinh-vien"
      />
      <ModalExport
        apiExportAll={exportApi.diemThanhTichAll}
        api={""}
        showModal={modalDiemThanhTich}
        setShowModal={setModalExportDiemThanhTich}
        exportAll={true}
        data={lop}
        translation="sinh-vien-lop"
        text="Danh-sach"
      />
      <ModalExportExcel
        showModal={modalExportDiemDanh}
        setShowModal={setModalExportDiemDanh}
        exportAll={true}
        data={lop}
        translation="sinh-vien-lop"
        api={exportApi.excelDiemDanhAll}
        text="danh-sach-diem-danh"
      />
      <ModalExportExcel
        showModal={modalExportSinhVien}
        setShowModal={setModalExportSinhVien}
        exportAll={true}
        data={lop}
        translation="sinh-vien-lop"
        api={exportApi.excelSinhVienAll}
        text="danh-sach-sinh-vien"
      />
    </PageContainer>
  );
};

export default LopHocDetailPage;
